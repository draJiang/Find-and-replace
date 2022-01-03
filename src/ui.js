import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './ui.css';
class ListItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: this.props
        };
    }
    // console.log('ListItem:');
    // console.log(props);
    render() {
        console.log('ListItem:');
        console.log(this.state.data);
        return (React.createElement("div", null,
            React.createElement("li", { key: this.state.data.data.id }, this.state.data.data.characters)));
    }
}
class SearchResultsList extends React.Component {
    constructor(props) {
        super(props);
        this.result_list_emty = (type) => {
            this.props.result_list_emty(type);
        };
        this.state = {
        // data: this.props
        };
    }
    listItemHandleClick(item) {
        console.log('listItemHandleClick');
        console.log('this:');
        console.log(this);
        console.log('item:');
        console.log(item);
        // var obj = JSON.stringify(this)
        parent.postMessage({ pluginMessage: { type: 'listOnClik', data: { 'item': this['id'], 'start': this['start'], 'end': this['end'] } } }, '*');
    }
    render() {
        console.log('SearchResultsList render:');
        console.log(this.props);
        var list = this.props.data;
        console.log(list);
        console.log(this.props['list_state']);
        if (this.props['list_state'] == 'find_loading') {
            console.log('find_loading:');
            this.result_list_emty(true);
            console.log(this.props['find_loading']);
            console.log('return:find_loading...div');
            return (React.createElement("div", { className: 'find_result_list_info' }, "find_loading..."));
        }
        if (this.props['list_state'] == 'replace') {
            console.log('list_state');
            this.result_list_emty(true);
            return (React.createElement("div", { className: 'find_result_list_info' }, "\u2705 has all been replaced with the target text"));
        }
        if (list == undefined || list == [] || list.length == 0) {
            this.result_list_emty(true);
            return (React.createElement("div", { className: 'find_result_list_info' }, "\uD83D\uDE05 No results found"));
        }
        else if (list.length) {
            this.result_list_emty(false);
        }
        list.forEach((node) => {
            console.log('list.forEach:');
            var this_start = node['start'] - 14; // 关键词前 x 个字符开始截取
            if (this_start < 0) {
                this_start = 0;
            }
            console.log(node['characters']);
            console.log(node['characters'].indexOf('<span class="heightLight">'));
            if (node['characters'].indexOf('<span class="heightLight">') < 0) {
                if (this_start > 0) {
                    node['characters'] = '...' + node['characters'].substring(this_start, node['start']) + '<span class="heightLight">' + node['characters'].substring(node['start'], node['end']) + '</span>' + node['characters'].substring(node['end']);
                }
                else {
                    node['characters'] = node['characters'].substring(0, node['start']) + '<span class="heightLight">' + node['characters'].substring(node['start'], node['end']) + '</span>' + node['characters'].substring(node['end']);
                }
            }
        });
        console.log(list);
        const listItems = list.map((node, index) => React.createElement("li", { onClick: this.listItemHandleClick.bind(node), key: node['id'] + ':' + index.toString(), dangerouslySetInnerHTML: { __html: node['characters'] } })
        // <li>123</li>
        );
        console.log('listItems:');
        console.log(listItems);
        // const listItems = list.forEach((node)=>{
        //   <li key = {node.id}>{node.characters}</li>
        // })
        return (
        // 可点击状态
        React.createElement("div", { className: 'find_result_list' }, listItems));
    }
}
class App extends React.Component {
    constructor(props) {
        super(props);
        this.keywordRef = (element) => {
            if (element)
                element.value = '';
            this.keyword = element;
        };
        this.replace_word_Ref = (element) => {
            if (element)
                element.value = '';
            this.replace_word = element;
        };
        this.onSearch = () => {
            const keyword = this.keyword.value;
            const replace_word = this.replace_word.value;
            parent.postMessage({ pluginMessage: { type: 'search', data: { 'keyword': keyword, 'replace_word': replace_word } } }, '*');
        };
        this.onReplace = () => {
            const keyword = this.keyword.value;
            const replace_word = this.replace_word.value;
            parent.postMessage({ pluginMessage: { type: 'replace', data: { 'keyword': keyword, 'replace_word': replace_word } } }, '*');
        };
        this.onFindInputChange = (e) => {
            console.log('onFindInputChange:');
            console.log(e);
            console.log(e.nativeEvent.data);
            console.log(e.nativeEvent.path[0]);
            console.log(e.nativeEvent.path[0].value);
            if (e.nativeEvent.path[0].value == '') {
                // 文本框为空
                this.setState({
                    findButtonDisable: true,
                });
            }
            else {
                this.setState({
                    findButtonDisable: false,
                });
            }
        };
        this.result_list_emty = (type) => {
            console.log('App :result_list_emty');
            console.log(type);
            console.log(this.state['result_list_emty']);
            if (type != this.state['result_list_emty']) {
                if (type) {
                    this.setState({
                        result_list_emty: true
                    });
                }
                else {
                    this.setState({
                        result_list_emty: false
                    });
                }
            }
        };
        this.state = {
            search_results_list: [],
            list_state: false,
            selectionPage: true,
            findButtonDisable: true,
            replaceButtonDisable: true,
            result_list_emty: true,
            find_loading: false,
        };
    }
    // 组件载入时
    componentDidMount() {
        onmessage = (event) => {
            console.log('onmessage');
            console.log(event);
            if (event.data.pluginMessage['type'] == 'find') {
                var target_Text_Node = event.data.pluginMessage.target_Text_Node;
                console.log('code.ts: onmessage find');
                console.log(target_Text_Node);
                if (target_Text_Node == {}) {
                    target_Text_Node == [];
                }
                this.setState({
                    search_results_list: target_Text_Node,
                    list_state: 'find'
                });
            }
            if (event.data.pluginMessage['type'] == 'find_loading') {
                console.log('code.js onmessage find_loading');
                this.setState({
                    list_state: 'find_loading'
                });
            }
            if (event.data.pluginMessage['type'] == 'replace') {
                console.log('ui.tsx:onmessage');
                console.log(event.data.pluginMessage['type']);
                this.setState({
                    list_state: 'replace'
                });
            }
            if (event.data.pluginMessage['type'] == 'onSelectionChange') {
                this.setState({
                    selectionPage: event.data.pluginMessage['selectionPage']
                });
            }
        };
    }
    render() {
        console.log('APP render this.state.search_results_list:');
        var note_list = this.state.search_results_list;
        console.log(note_list);
        console.log(this.state);
        console.log(this.state.findButtonDisable);
        if (this.state.findButtonDisable) {
            // 按钮置灰
            var findButton = React.createElement("button", { className: 'buttonDisable', id: "search", onClick: this.onSearch }, "Find");
        }
        else {
            var findButton = React.createElement("button", { id: "search", onClick: this.onSearch }, "Find");
        }
        if (this.state.result_list_emty) {
            // 按钮置灰
            var replaceButton = React.createElement("button", { className: 'buttonDisable', id: "replace", onClick: this.onReplace }, "Replace");
        }
        else {
            var replaceButton = React.createElement("button", { id: "replace", onClick: this.onReplace }, "Replace");
        }
        // const listItems = note_list.map((node) =>
        // <ListItem data={node} />
        //   // <li key = {node.id}>{node.characters}</li>
        // )
        var input_placeholder;
        if (this.state.selectionPage) {
            input_placeholder = 'Search in the current page';
        }
        else {
            input_placeholder = 'Search in the selected layer';
        }
        return (React.createElement("div", null,
            React.createElement("div", { id: 'topBox' },
                React.createElement("div", { className: 'inputBox' },
                    React.createElement("p", null, "Find"),
                    React.createElement("div", null,
                        React.createElement("input", { onInput: this.onFindInputChange, placeholder: input_placeholder, ref: this.keywordRef }),
                        findButton)),
                React.createElement("div", { className: 'inputBox' },
                    React.createElement("p", null, "Replace"),
                    React.createElement("div", null,
                        React.createElement("input", { ref: this.replace_word_Ref }),
                        replaceButton))),
            React.createElement(SearchResultsList, { find_loading: this.state.find_loading, result_list_emty: this.result_list_emty, list_state: this.state.list_state, data: this.state.search_results_list })));
    }
}
ReactDOM.render(React.createElement(App, null), document.getElementById('react-page'));
