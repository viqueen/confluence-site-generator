import React from 'react';
import './MediaFile.css';

interface MediaFileProps {
    fileId: string;
    width: number;
    height: number;
    layout?: string;
}

export default function MediaFile(props: MediaFileProps) {
    const layoutClass = props.layout ? `layout-${props.layout}` : `layout`;
    return (
        <div className="media-file">
            <img
                src={`/attachments/${props.fileId}`}
                style={{ height: props.height, maxHeight: 600 }}
                className={layoutClass}
            />
        </div>
    );
}
