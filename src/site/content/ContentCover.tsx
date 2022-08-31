import React from 'react';

interface ContentCoverProps {
    fileId: string;
}

export default function ContentCover({ fileId }: ContentCoverProps) {
    return (
        <img
            src={`/attachments/${fileId}`}
            style={{
                height: 300,
                objectFit: 'cover',
                width: '100%',
                display: 'flex'
            }}
            className="media-file"
            alt={'its-a-cover-up'}
        />
    );
}
