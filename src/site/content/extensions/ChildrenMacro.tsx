import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Spinner from '@atlaskit/spinner';
import { titleToPath } from '../../index';
import { Identifier } from 'confluence-content-extractor/dist/confluence/api';

interface ChildrenMacroPops {
    parent?: string;
    children: Array<Identifier>;
}

export default function ChildrenMacro(props: ChildrenMacroPops) {
    const [loading, setLoading] = useState(true);
    const [childPages, setChildPages]: any = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            if (props.parent) {
                setLoading(true);
                const { data } = await axios.get(
                    `/notes/${titleToPath(props.parent)}/data.json`
                );
                setChildPages(data.children);
                setLoading(false);
            } else {
                setChildPages(props.children);
                setLoading(false);
            }
        };
        // noinspection JSIgnoredPromiseFromCall
        fetchData();
    }, []);

    return (
        <div>
            {loading && <Spinner size="small" />}
            {!loading && childPages.length > 0 && (
                <ul style={{ marginTop: 0 }}>
                    {childPages.map((child: { id: string; title: string }) => {
                        return (
                            <li key={child.id}>
                                <a
                                    href={`/notes/${titleToPath(child.title)}/`}
                                    style={{
                                        textDecoration: 'none',
                                        color: '#0052CC',
                                        fontSize: 16
                                    }}
                                >
                                    {child.title}
                                </a>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}
