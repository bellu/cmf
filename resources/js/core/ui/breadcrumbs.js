"use strict";

import React from 'react';

export default class Breadcrumbs extends React.Component {

    static defaultProps = {
        rootText: 'My files',
        onClick: (item) => {}
    };

    onClick(item) {
        this.props.onClick(item);
    }

    render() {
        return (
            <div className="breadcrumbs">
                <ul className={'breadcrumbs__list'}>
                    <li onClick={e => this.onClick(null)}>
                        {this.props.rootText}
                    </li>
                    {this.props.items.map((item, i) => {
                        return (
                            <li key={i} onClick={e => this.onClick(item)}>
                                {item.name}
                            </li>
                        );
                    })}
                </ul>
            </div>
        );
    }
}