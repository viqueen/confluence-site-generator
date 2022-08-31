import React from 'react';

interface WidgetConnectorMacroProps {
    url: string;
}

const SPOTIFY_TRACK =
    /^https:\/\/open\.spotify\.com\/track\/(?<trackId>[a-zA-Z0-9]+)(\?.*)?$/;
const YOUTUBE_VIDEO =
    /^https:\/\/www\.youtube\.com\/watch\?v=(?<videoId>[\w]+)$/;

const spotifyEmbed = (trackId?: string) => {
    if (!trackId) return <></>;
    const embedUrl = `https://open.spotify.com/embed/track/${trackId}`;
    return (
        <div style={{ textAlign: 'center' }}>
            <iframe
                style={{ borderRadius: 12 }}
                src={embedUrl}
                width="50%"
                height="380"
                frameBorder="0"
                allowFullScreen={false}
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            />
        </div>
    );
};

const youtubeEmbed = (videoId?: string) => {
    if (!videoId) return <></>;
    const embedUrl = `https://www.youtube.com/embed/${videoId}`;
    return (
        <div style={{ textAlign: 'center' }}>
            <iframe
                width="560"
                height="315"
                src={embedUrl}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen={false}
            />
        </div>
    );
};

export default function WidgetConnectorMacro({
    url
}: WidgetConnectorMacroProps) {
    const spotify = url.match(SPOTIFY_TRACK);
    if (spotify) return spotifyEmbed(spotify.groups?.trackId);

    const youtube = url.match(YOUTUBE_VIDEO);
    if (youtube) return youtubeEmbed(youtube.groups?.videoId);

    return <></>;
}
