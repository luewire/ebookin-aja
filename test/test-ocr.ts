const text = `
blancstudia, Digital & Kr
BANYUMAS
-Rp25.000
Transaction ID
260226-CVYP-KH4WKV
From
Main Pocket
Source Of Fund
109563893445
Date and time
26 February 2026, 06.32
Acquirer Name
GoPay
Fee
Free
Merchant PAN
`;

const MERCHANT_KEYWORDS = ['BLANCSTUDIA', 'DIGITAL & KREATIF', 'DIGITAL', 'KREATIF'];
// Added generic success indicators like "TRANSACTION ID"
const SUCCESS_KEYWORDS = ['BERHASIL', 'SUKSES', 'SUCCESS', 'SUCCESSFUL', 'PEMBAYARAN BERHASIL', 'TRANSAKSI BERHASIL', 'TRANSACTION ID'];

function checkDateInText(text: string): { valid: boolean; found: string | null } {
    const now = new Date('2026-02-26'); // Stub today to match the receipt

    const monthNamesId = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const monthNamesEn = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const monthShort = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

    const day = now.getDate();
    const month = now.getMonth();
    const year = now.getFullYear();

    const datePatterns = [
        `${day}/${month + 1}/${year}`,
        `${day.toString().padStart(2, '0')}/${(month + 1).toString().padStart(2, '0')}/${year}`,
        `${day}-${month + 1}-${year}`,
        `${day.toString().padStart(2, '0')}-${(month + 1).toString().padStart(2, '0')}-${year}`,
        `${day} ${monthNamesId[month]} ${year}`,
        `${day} ${monthNamesEn[month]} ${year}`,
        `${day} ${monthShort[month]} ${year}`,
        `${day} ${monthNamesId[month]}`,
        `${day} ${monthNamesEn[month]}`,
        `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`,
    ];

    const upperText = text.toUpperCase();
    for (const pattern of datePatterns) {
        if (upperText.includes(pattern.toUpperCase())) {
            return { valid: true, found: pattern };
        }
    }
    return { valid: false, found: null };
}

const upperText = text.toUpperCase();

let nominalValid = text.includes('Rp25.000');
let merchantValid = false;
for (const k of MERCHANT_KEYWORDS) { if (upperText.includes(k.toUpperCase())) merchantValid = true; }
let statusValid = false;
for (const k of SUCCESS_KEYWORDS) { if (upperText.includes(k.toUpperCase())) statusValid = true; }
let dateCheck = checkDateInText(text);

console.log({ nominalValid, merchantValid, statusValid, dateValid: dateCheck.valid });
