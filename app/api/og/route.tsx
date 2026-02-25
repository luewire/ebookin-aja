import { ImageResponse } from 'next/og';
// App router includes @vercel/og inside next/og

export const runtime = 'edge';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);

        // Dynamic params
        const title = searchParams.has('title')
            ? searchParams.get('title')?.slice(0, 100)
            : 'Ebookin Aja';

        const author = searchParams.has('author')
            ? searchParams.get('author')?.slice(0, 60)
            : 'Premium Reading Platform';

        const coverUrl = searchParams.get('cover');

        return new ImageResponse(
            (
                <div
                    style={{
                        height: '100%',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#0D0D12',
                        backgroundImage: 'radial-gradient(circle at 50% -20%, #4C1D2E 0%, #13131A 60%, #0D0D12 100%)',
                        fontFamily: 'system-ui',
                        color: '#F0EEF6',
                        padding: '40px',
                    }}
                >
                    {/* Logo */}
                    <div
                        style={{
                            position: 'absolute',
                            top: 40,
                            left: 40,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                        }}
                    >
                        <div style={{ color: '#F43F5E', fontSize: 32, fontWeight: 'bold' }}>📚</div>
                        <div style={{ fontSize: 28, fontWeight: 'bold', letterSpacing: '0.05em' }}>Ebookin Aja</div>
                    </div>

                    <div
                        style={{
                            display: 'flex',
                            width: '100%',
                            maxWidth: '1000px',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '64px',
                            marginTop: '40px',
                        }}
                    >
                        {coverUrl && (
                            <div
                                style={{
                                    display: 'flex',
                                    width: '320px',
                                    height: '480px',
                                    borderRadius: '16px',
                                    overflow: 'hidden',
                                    boxShadow: '0 24px 48px rgba(0,0,0,0.8), 0 0 0 2px rgba(244, 63, 94, 0.3)',
                                }}
                            >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={coverUrl} alt="Cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                        )}

                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                flex: 1,
                                gap: '16px',
                            }}
                        >
                            <div
                                style={{
                                    fontSize: coverUrl ? 64 : 80,
                                    fontWeight: 800,
                                    lineHeight: 1.1,
                                    background: 'linear-gradient(135deg, #F0EEF6, #8B8A9B)',
                                    backgroundClip: 'text',
                                    color: 'transparent',
                                }}
                            >
                                {title}
                            </div>
                            <div
                                style={{
                                    fontSize: coverUrl ? 32 : 40,
                                    fontWeight: 500,
                                    color: '#F43F5E',
                                    marginTop: '16px',
                                }}
                            >
                                {author}
                            </div>
                        </div>
                    </div>
                </div>
            ),
            {
                width: 1200,
                height: 630,
            },
        );
    } catch (e: any) {
        console.error('OG Image Generation Error:', e);
        return new Response(`Failed to generate the image`, {
            status: 500,
        });
    }
}
