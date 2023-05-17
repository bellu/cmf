import React from 'react';
import Field from '../core/ui/field';
import Button from "../core/ui/button";
import IconButton from "../core/ui/icon-button";
import Placeholder from "../core/ui/placeholder";
import components from "../rendering/components";
import i18n from "../util/i18n";
import str from "../util/str";

class JsonField extends React.Component {

    static defaultProps = {
        id: 0,
        data: {},
        label: '',
        name: '',
        plural: '',
        singular: '',
        tooltip: '',
        components: [],
        errors: {}
    };

    constructor(props) {
        super(props);

        this.componentLists = [];

        this.state = {
            addedItems: this.props.data[this.props.name] || []
        };
    }

    handleSubmit(data) {

        let payload = [];

        this.componentLists.forEach(componentList => {
            let itemData = {};
            componentList.forEach(item => {
                item.ref.current.handleSubmit(itemData);
            });
            payload.push(itemData);
        });

        data[this.props.name] = JSON.stringify(payload);
    }

    getData(data) {

        let array = [];
        this.componentLists.forEach(componentList => {
            let itemData = {};
            componentList.forEach(item => {
                item.ref.current.handleSubmit(itemData);
            });
            array.push(itemData);
        });

        data[this.props.name] = array || [];
        return data;
    }

    componentDidUpdate(prevProps) {
        if (this.props.data[this.props.name] !== prevProps.data[this.props.name]) {
            if (this.props.data[this.props.name]) {
                this.setState({
                    addedItems: this.props.data[this.props.name]
                });
            }
        }
    }

    addItem() {
        this.setState({
            addedItems: [...this.state.addedItems, {}]
        });
    }

    sortUp(index) {

        if (index <= 0) return;

        let addedItems = this.state.addedItems;
        let upIndex = index - 1;

        [addedItems[index], addedItems[upIndex]] = [addedItems[upIndex], addedItems[index]];

        this.setState({addedItems});
    }

    sortDown(index) {

        if (index >= this.state.addedItems.length - 1) return;

        let addedItems = this.state.addedItems;
        let downIndex = index + 1;

        [addedItems[index], addedItems[downIndex]] = [addedItems[downIndex], addedItems[index]];

        this.setState({addedItems});
    }

    removeItem(index) {

        let addedItems = this.state.addedItems;
        addedItems.splice(index, 1);

        this.setState({addedItems});
    }

    renderItems() {

        this.componentLists = [];

        if (! this.state.addedItems.length) {
            return <Placeholder onClick={this.addItem.bind(this)} icon={'post_add'}>No {this.props.plural} added yet</Placeholder>;
        }

        return this.state.addedItems.map((item, i) => {
            let componentList = components.renderComponentsWith(this.props.components, item, this.props.path, (component, i) => {
                return (
                    <div className="json-field__component" key={i}>
                        {component}
                    </div>
                );
            }, true, this.props.errors);

            this.componentLists.push(componentList);

            return (
                <div className="json-field__item" key={i}>
                    <div className="json-field__item-content">
                        {componentList.map(obj => obj.component)}
                    </div>
                    <div className="json-field__item-actions">
                        <IconButton style={['transparent', (i > 0 ? 'enabled' : 'disabled')]} iconStyle={'mini'} name={'arrow_upward'} onClick={e => this.sortUp(i)} />
                        <IconButton style={['transparent', (i < this.state.addedItems.length - 1 ? 'enabled' : 'disabled')]} iconStyle={'mini'} name={'arrow_downward'} onClick={e => this.sortDown(i)} />
                        <IconButton style={'transparent'} iconStyle={'mini'} name={'delete'} onClick={e => this.removeItem(i)} />
                    </div>
                </div>
            );
        });
    }

    render() {
        return (
            <Field
                name={this.props.name}
                label={this.props.label}
                tooltip={this.props.tooltip}
            >
                <div className={'json-field'}>
                    <div className="json-field__content">
                        {this.renderItems()}
                    </div>
                    <div className="json-field__footer">
                        <Button
                            onClick={this.addItem.bind(this)}
                            icon={'add'}
                            style={['small', 'secondary']}
                            text={str.toUpperCaseFirst(i18n.get('snippets.add_singular', {singular: this.props.singular}))}
                        />
                    </div>
                </div>
            </Field>
        );
    }
}

export default JsonField;
