import { GoogleGenAI, Type } from '@google/genai';

/**
 * OCR Validation Service using Google Gemini 1.5 Flash
 * Validates payment proof images for auto-approval
 */

// Merchant info for validation
const MERCHANT_KEYWORDS = ['BLANCSTUDIA', 'DIGITAL & KREATIF', 'DIGITAL', 'KREATIF'];
const SUCCESS_KEYWORDS = ['BERHASIL', 'SUKSES', 'SUCCESS', 'SUCCESSFUL', 'PEMBAYARAN BERHASIL', 'TRANSAKSI BERHASIL', 'TRANSACTION ID', 'REF', 'REFERENSI', 'TRX'];

// Plan amount mapping
const PLAN_AMOUNTS: Record<string, { amount: number }> = {
    '1month': { amount: 25000 },
    '3months': { amount: 70000 },
    '1year': { amount: 240000 },
};

export interface OcrValidationResult {
    autoApprove: boolean;
    extractedText: string;
    reason: string;
    validationDetail: {
        nominalValid: boolean;
        merchantValid: boolean;
        statusValid: boolean;
        dateValid: boolean;
        nominalFound: string | null;
        merchantFound: string | null;
        statusFound: string | null;
        dateFound: string | null;
    };
}

/**
 * Download image and convert to base64
 */
async function fetchImageBase64(imageUrl: string): Promise<{ mimeType: string; data: string }> {
    const response = await fetch(imageUrl);
    if (!response.ok) {
        throw new Error(`Failed to download image: ${response.status}`);
    }
    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const arrayBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');
    return { mimeType: contentType, data: base64 };
}

/**
 * Helper to check if a YYYY-MM-DD string is today
 */
function isDateToday(dateString: string): boolean {
    if (!dateString) return false;
    const now = new Date();
    // Use Indonesian time (WIB UTC+7) for safety if server is UTC
    // A simple hack is to get the current date string in local timezone
    const parts = dateString.split("-");
    if (parts.length !== 3) return false;

    // We can just rely on the server's local time (or if we need strict WIB we can adjust)
    // Here we'll just check if it matches today's date in local server time
    const date = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    return date.getDate() === now.getDate() &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear();
}

/**
 * Main validation function using Gemini
 */
export async function validatePaymentProof(
    imageUrl: string,
    planId: string
): Promise<OcrValidationResult> {
    const planConfig = PLAN_AMOUNTS[planId];

    if (!planConfig) {
        return {
            autoApprove: false,
            extractedText: '',
            reason: `Paket tidak dikenali: ${planId}`,
            validationDetail: {
                nominalValid: false, merchantValid: false, statusValid: false, dateValid: false,
                nominalFound: null, merchantFound: null, statusFound: null, dateFound: null,
            },
        };
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error('GEMINI_API_KEY is not configured');
    }

    const ai = new GoogleGenAI({ apiKey });

    let extractedData;
    let rawJsonResponse = '';

    try {
        const image = await fetchImageBase64(imageUrl);

        const prompt = `Anda adalah asisten AI untuk memvalidasi bukti transfer pembayaran.
Tolong ekstrak informasi berikut dari gambar bukti transfer ini dan kembalikan dalam format JSON.
Properti yang dibutuhkan dalam JSON:
- "nominal": Angka jumlah transfer/pembayaran (integer, contoh: 25000, tulis angka bulat saja tanpa Rp/titik)
- "merchantName": Nama tujuan transfer atau merchant (string)
- "status": Status transaksi, misalnya "Berhasil", "Sukses", "Pending" (string)
- "tanggal": Tanggal transaksi dalam format "YYYY-MM-DD" (string)
- "rawText": Teks mentah paling relevan yang terlihat di struk untuk keperluan debug (string)`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [
                prompt,
                {
                    inlineData: {
                        mimeType: image.mimeType,
                        data: image.data
                    }
                }
            ],
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        nominal: { type: Type.INTEGER },
                        merchantName: { type: Type.STRING },
                        status: { type: Type.STRING },
                        tanggal: { type: Type.STRING },
                        rawText: { type: Type.STRING }
                    },
                    required: ["nominal", "merchantName", "status", "tanggal", "rawText"]
                }
            }
        });

        const textResponse = response.text;
        rawJsonResponse = textResponse || '{}';
        extractedData = JSON.parse(rawJsonResponse);

    } catch (error: any) {
        console.error('[OCR] Gemini processing failed:', error.message);
        return {
            autoApprove: false,
            extractedText: '',
            reason: 'Gambar tidak terbaca dengan jelas oleh AI, menunggu verifikasi admin.',
            validationDetail: {
                nominalValid: false, merchantValid: false, statusValid: false, dateValid: false,
                nominalFound: null, merchantFound: null, statusFound: null, dateFound: null,
            },
        };
    }

    if (!extractedData) {
        return {
            autoApprove: false,
            extractedText: rawJsonResponse,
            reason: 'Gagal mengekstrak struktur data dari gambar.',
            validationDetail: {
                nominalValid: false, merchantValid: false, statusValid: false, dateValid: false,
                nominalFound: null, merchantFound: null, statusFound: null, dateFound: null,
            },
        };
    }

    const { nominal, merchantName, status, tanggal, rawText } = extractedData;
    const extractedText = rawJsonResponse; // Simpan JSON string sbg extractedText fallback DB

    // 1. Check nominal
    const nominalFound = typeof nominal === 'number' ? String(nominal) : String(nominal || '');
    const nominalValid = (nominal === planConfig.amount);

    // 2. Check merchant
    let merchantValid = false;
    let merchantFound: string | null = merchantName || null;
    const upperMerchant = (merchantName || '').toUpperCase();
    const upperRawText = (rawText || '').toUpperCase();

    for (const keyword of MERCHANT_KEYWORDS) {
        if (upperMerchant.includes(keyword.toUpperCase()) || upperRawText.includes(keyword.toUpperCase())) {
            merchantValid = true;
            merchantFound = keyword; // Simpan keyword yg me-match
            break;
        }
    }

    // 3. Check status
    let statusValid = false;
    let statusFound: string | null = status || null;
    const upperStatus = (status || '').toUpperCase();
    for (const keyword of SUCCESS_KEYWORDS) {
        if (upperStatus.includes(keyword.toUpperCase()) || upperRawText.includes(keyword.toUpperCase())) {
            statusValid = true;
            statusFound = keyword;
            break;
        }
    }

    // 4. Check date
    const dateValid = isDateToday(tanggal);
    const dateFound = tanggal || null;

    const validationDetail = {
        nominalValid, merchantValid, statusValid, dateValid,
        nominalFound, merchantFound, statusFound, dateFound,
    };

    // Auto-approve only if ALL checks pass
    const autoApprove = nominalValid && merchantValid && statusValid && dateValid;

    // Build reason
    const failReasons: string[] = [];
    if (!nominalValid) failReasons.push(`Nominal tidak sesuai (harus ${planConfig.amount}, didapat ${nominal})`);
    if (!merchantValid) failReasons.push('Merchant tidak sesuai atau tidak ditemukan');
    if (!statusValid) failReasons.push('Status bukan berhasil');
    if (!dateValid) failReasons.push(`Tanggal tidak sesuai hari ini (didapat ${tanggal})`);

    const reason = autoApprove
        ? 'Semua validasi terpenuhi melalui AI, pembayaran terverifikasi otomatis.'
        : `Verifikasi gagal: ${failReasons.join(', ')}. Menunggu review admin.`;

    return {
        autoApprove,
        extractedText,
        reason,
        validationDetail,
    };
}
