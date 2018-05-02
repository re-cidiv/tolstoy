import React from 'react';
import { Link } from 'react-router'
import Icon from 'app/components/elements/Icon.jsx';

export default class HorizontalMenu extends React.Component {
    static propTypes = {
        items: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
        title: React.PropTypes.string,
        className: React.PropTypes.string,
        hideValue: React.PropTypes.string,
    };

    render() {
        const {children, items, title, className, hideValue, isAnchor} = this.props;
        return <ul className={'HorizontalMenu menu' + (className ? ' ' + className : '')}>
            {children}
            {title && <li className="title">{title}</li>}
            {items.map(i => {
                if (i.value === hideValue) return null
                return <li key={i.value} className={i.active ? 'active' : null}>
                    {i.link ? isAnchor ? <a href={i.link} >{i.label ? i.label : i.value}</a>
                    : <Link to={i.link} onClick={i.onClick}>
                        {i.icon && <Icon name={i.icon} />}{i.label ? i.label : i.value}
                    </Link> :
                    <span>
                        {i.icon && <Icon name={i.icon} />}{i.label ? i.label : i.value}
                    </span>
                    }
                </li>
            })}
        </ul>;
    }
}
