async function testVisonAPI() {
    const apiKey = process.env.VISION_API_KEY || ""; // Value from .env.local

    // Download a sample image
    const imageUrl = "https://raw.githubusercontent.com/tesseract-ocr/test/master/testing/phototest.tif";
    const imageResponse = await fetch(imageUrl);
    const imageBuffer = await imageResponse.arrayBuffer();
    const base64Image = Buffer.from(imageBuffer).toString('base64');

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
        const body = await visionResponse.text();
        console.error("Failed:", visionResponse.status, body);
        return;
    }

    const data = await visionResponse.json() as any;
    console.log("Success! Extracted text length:", data.responses?.[0]?.textAnnotations?.[0]?.description?.length);
    console.log("Extracted text snippet:", data.responses?.[0]?.textAnnotations?.[0]?.description?.substring(0, 50));
}

testVisonAPI().catch(console.error);
