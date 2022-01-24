import React from 'react';
import Avatar, { SizeType } from '@atlaskit/avatar';

interface ProfilePictureProps {
    accountId: string;
    size: string;
}

const sizeMap: Record<string, SizeType | undefined> = {
    'extra large': 'xxlarge'
};

export default function ProfilePicture(props: ProfilePictureProps) {
    const size = sizeMap[props.size] || 'large';
    return (
        <div>
            <Avatar src={`/assets/avatars/${props.accountId}`} size={size} />
        </div>
    );
}
