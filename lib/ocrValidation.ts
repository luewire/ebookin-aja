/**
 * OCR Validation Service using Google Cloud Vision API
 * Validates QRIS payment proof images for auto-approval
 */

// Merchant info for validation
const MERCHANT_KEYWORDS = ['BLANCSTUDIA', 'DIGITAL & KREATIF', 'DIGITAL', 'KREATIF'];
const SUCCESS_KEYWORDS = ['BERHASIL', 'SUKSES', 'SUCCESS', 'SUCCESSFUL', 'PEMBAYARAN BERHASIL', 'TRANSAKSI BERHASIL'];

// Plan amount mapping
const PLAN_AMOUNTS: Record<string, { amount: number; patterns: string[] }> = {
    '1month': { amount: 25000, patterns: ['25.000', '25,000', '25000', 'Rp25.000', 'Rp 25.000'] },
    '3months': { amount: 70000, patterns: ['70.000', '70,000', '70000', 'Rp70.000', 'Rp 70.000'] },
    '1year': { amount: 240000, patterns: ['240.000', '240,000', '240000', 'Rp240.000', 'Rp 240.000'] },
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
 * Call Google Cloud Vision API to extract text from an image URL
 */
async function extractTextFromImage(imageUrl: string): Promise<string> {
    const apiKey = process.env.GOOGLE_CLOUD_VISION_API_KEY;

    if (!apiKey) {
        throw new Error('GOOGLE_CLOUD_VISION_API_KEY is not configured');
    }

    // Download image and convert to base64
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
        throw new Error(`Failed to download image: ${imageResponse.status}`);
    }

    const imageBuffer = await imageResponse.arrayBuffer();
    const base64Image = Buffer.from(imageBuffer).toString('base64');

    // Call Google Cloud Vision API
    const visionResponse = await fetch(
        `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                requests: [
                    {
                        image: { content: base64Image },
                        features: [{ type: 'TEXT_DETECTION', maxResults: 1 }],
                    },
                ],
            }),
        }
    );

    if (!visionResponse.ok) {
        const errBody = await visionResponse.text();
        console.error('[OCR] Vision API error:', errBody);
        throw new Error(`Vision API error: ${visionResponse.status}`);
    }

    const data = await visionResponse.json();
    const textAnnotations = data.responses?.[0]?.textAnnotations;

    if (!textAnnotations || textAnnotations.length === 0) {
        return '';
    }

    // First annotation is the full text
    return textAnnotations[0].description || '';
}

/**
 * Check if today's date is present in the text
 */
function checkDateInText(text: string): { valid: boolean; found: string | null } {
    const now = new Date();

    // Indonesian month names
    const monthNamesId = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const monthShort = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

    const day = now.getDate();
    const month = now.getMonth(); // 0-indexed
    const year = now.getFullYear();

    // Various date formats to check
    const datePatterns = [
        `${day}/${month + 1}/${year}`,           // 26/2/2026
        `${day.toString().padStart(2, '0')}/${(month + 1).toString().padStart(2, '0')}/${year}`, // 26/02/2026
        `${day}-${month + 1}-${year}`,           // 26-2-2026
        `${day.toString().padStart(2, '0')}-${(month + 1).toString().padStart(2, '0')}-${year}`, // 26-02-2026
        `${day} ${monthNamesId[month]} ${year}`, // 26 Februari 2026
        `${day} ${monthShort[month]} ${year}`,   // 26 Feb 2026
        `${day} ${monthNamesId[month]}`,         // 26 Februari (without year)
        `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`, // 2026-02-26
    ];

    const upperText = text.toUpperCase();

    for (const pattern of datePatterns) {
        if (upperText.includes(pattern.toUpperCase())) {
            return { valid: true, found: pattern };
        }
    }

    return { valid: false, found: null };
}

/**
 * Main validation function
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

    let extractedText = '';

    try {
        extractedText = await extractTextFromImage(imageUrl);
    } catch (error: any) {
        console.error('[OCR] Text extraction failed:', error.message);
        return {
            autoApprove: false,
            extractedText: '',
            reason: 'Gambar tidak terbaca dengan jelas, menunggu verifikasi admin.',
            validationDetail: {
                nominalValid: false, merchantValid: false, statusValid: false, dateValid: false,
                nominalFound: null, merchantFound: null, statusFound: null, dateFound: null,
            },
        };
    }

    if (!extractedText || extractedText.trim().length < 10) {
        return {
            autoApprove: false,
            extractedText,
            reason: 'Teks pada gambar terlalu sedikit atau tidak terbaca.',
            validationDetail: {
                nominalValid: false, merchantValid: false, statusValid: false, dateValid: false,
                nominalFound: null, merchantFound: null, statusFound: null, dateFound: null,
            },
        };
    }

    const upperText = extractedText.toUpperCase();

    // 1. Check nominal
    let nominalValid = false;
    let nominalFound: string | null = null;
    for (const pattern of planConfig.patterns) {
        if (extractedText.includes(pattern)) {
            nominalValid = true;
            nominalFound = pattern;
            break;
        }
    }

    // 2. Check merchant
    let merchantValid = false;
    let merchantFound: string | null = null;
    for (const keyword of MERCHANT_KEYWORDS) {
        if (upperText.includes(keyword.toUpperCase())) {
            merchantValid = true;
            merchantFound = keyword;
            break;
        }
    }

    // 3. Check success status
    let statusValid = false;
    let statusFound: string | null = null;
    for (const keyword of SUCCESS_KEYWORDS) {
        if (upperText.includes(keyword.toUpperCase())) {
            statusValid = true;
            statusFound = keyword;
            break;
        }
    }

    // 4. Check date
    const dateCheck = checkDateInText(extractedText);
    const dateValid = dateCheck.valid;
    const dateFound = dateCheck.found;

    const validationDetail = {
        nominalValid, merchantValid, statusValid, dateValid,
        nominalFound, merchantFound, statusFound, dateFound,
    };

    // Auto-approve only if ALL checks pass
    const autoApprove = nominalValid && merchantValid && statusValid && dateValid;

    // Build reason
    const failReasons: string[] = [];
    if (!nominalValid) failReasons.push('Nominal tidak sesuai');
    if (!merchantValid) failReasons.push('Merchant tidak ditemukan');
    if (!statusValid) failReasons.push('Status pembayaran tidak ditemukan');
    if (!dateValid) failReasons.push('Tanggal tidak sesuai hari ini');

    const reason = autoApprove
        ? 'Semua validasi terpenuhi, pembayaran terverifikasi otomatis.'
        : `Verifikasi gagal: ${failReasons.join(', ')}. Menunggu review admin.`;

    return {
        autoApprove,
        extractedText,
        reason,
        validationDetail,
    };
}
