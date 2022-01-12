import * as React from 'react';
import * as ReactDOM from 'react-dom';
import '../node_modules/figma-plugin-ds/dist/figma-plugin-ds.css';
import './ui.css';
class SearchResultsList extends React.Component {
    constructor(props) {
        super(props);
        // 搜索结果 hover 时
        // 搜索无结果时，通过此方法通知父组件更新 UI（主要是置灰替换按钮）
        this.result_list_emty = (type) => {
            this.props.result_list_emty(type);
        };
        this.state = {
        // data: this.props
        };
    }
    // 搜索结果项点击时
    listItemHandleClick(item) {
        console.log('listItemHandleClick');
        console.log('this:');
        console.log(this);
        console.log('item:');
        console.log(item);
        item.target.className = 'clicked';
        console.log(item);
        // 通知 code.ts 点击的是哪个项目
        parent.postMessage({ pluginMessage: { type: 'listOnClik', data: { 'item': this['id'], 'start': this['start'], 'end': this['end'] } } }, '*');
    }
    render() {
        console.log('SearchResultsList render:');
        console.log(this.props);
        var list = this.props.data;
        // console.log(list);
        // console.log(this.props['list_state']);
        // 搜索加载状态
        if (this.props['list_state'] == 'find_loading') {
            console.log('find_loading:');
            this.result_list_emty(true);
            console.log(this.props['find_loading']);
            console.log('return:find_loading...div');
            return (React.createElement("div", { className: 'find_result_list_info' },
                React.createElement("div", { className: " icon icon--spinner icon--spin " }, " "),
                " "));
        }
        // 替换
        if (this.props['list_state'] == 'replace') {
            console.log('list_state');
            return (React.createElement("div", { className: 'find_result_list_info' },
                React.createElement("div", null,
                    React.createElement("div", { className: 'main_info' }, "\u2705 Replaced"),
                    React.createElement("div", { className: 'minor_info' }, "Ignored locked, hidden layers"))));
        }
        // 搜索
        if (this.props['list_state'] == 'find') {
            if (list == undefined || list.length == 0) {
                // 空数据
                // this.result_list_emty(true)
                return (React.createElement("div", { className: 'find_result_list_info' }, "\uD83D\uDE05 No results found"));
            }
            else if (list.length) {
            }
            list.forEach((node) => {
                console.log('list.forEach:');
                console.log(node);
                var this_start = node['start'] - 20; // 关键词前 x 个字符开始截取
                if (this_start < 0) {
                    // 关键词前不足 14 个字符时，从头开始截取
                    this_start = 0;
                }
                // 关键字高亮显示
                if (node['characters'].indexOf('<span class="heightLight">') < 0) {
                    node['characters'] = node['characters'].substring(this_start, node['start']) + '<span class="heightLight">' + node['characters'].substring(node['start'], node['end']) + '</span>' + node['characters'].substring(node['end']);
                    // 关键词在段落中靠后，则前面加省略号
                    if (this_start > 0) {
                        node['characters'] = '...' + node['characters'];
                    }
                    // 文本长度过长，则后面加省略号
                    console.log('str length:');
                    console.log(node['characters'].length);
                    if (node['characters'].length > 60) {
                        node['characters'] = node['characters'].substring(0, node['end'] + 100) + '...';
                    }
                }
                let missIcon = '<span class="missIcon">A?</span>';
                // 字体若不兼容，则显示 UI 提示
                if (node['hasMissingFont'] && node['characters'].indexOf(missIcon) < 0) {
                    node['characters'] += missIcon;
                }
            });
            const listItems = list.map((node, index) => React.createElement("li", { onClick: this.listItemHandleClick.bind(node), key: node['id'] + ':' + index.toString(), dangerouslySetInnerHTML: { __html: node['characters'] } })
            // <li>123</li>
            );
            console.log('listItems:');
            // console.log(listItems);
            // const listItems = list.forEach((node)=>{
            //   <li key = {node.id}>{node.characters}</li>
            // })
            return (React.createElement("div", { className: 'find_result_list' }, listItems));
        }
        return (React.createElement("div", { className: 'find_result_list' }));
    }
}
class App extends React.Component {
    constructor(props) {
        super(props);
        // 搜索文本框
        this.keywordRef = (element) => {
            if (element) {
                element.value = '';
                element.focus();
            }
            this.keyword = element;
        };
        // 替换文本框
        this.replace_word_Ref = (element) => {
            if (element)
                element.value = '';
            this.replace_word = element;
        };
        // 搜索
        this.onSearch = () => {
            const keyword = this.keyword.value;
            const replace_word = this.replace_word.value;
            parent.postMessage({ pluginMessage: { type: 'search', data: { 'keyword': keyword, 'replace_word': replace_word } } }, '*');
        };
        // 替换
        this.onReplace = () => {
            const keyword = this.keyword.value;
            const replace_word = this.replace_word.value;
            parent.postMessage({ pluginMessage: { type: 'replace', data: { 'keyword': keyword, 'replace_word': replace_word } } }, '*');
        };
        // 文本框输入时
        this.onInputEnter = (e) => {
            console.log('enter');
            console.log(e.nativeEvent);
            console.log(this);
            // 监听回车键
            if (e.nativeEvent.keyCode == 13) {
                // 搜索
                if (e.nativeEvent.path[0].name == 'find' && e.nativeEvent.path[0].value != '') {
                    this.onSearch();
                }
                // 替换
                if (e.nativeEvent.path[0].name == 'replace' && this.state['result_list_emty'] != true) {
                    this.onReplace();
                }
            }
        };
        // 文本框值变化（用于搜索框）
        this.onFindInputChange = (e) => {
            console.log('onFindInputChange:');
            console.log(e);
            console.log(e.nativeEvent.data);
            console.log(e.nativeEvent.path[0]);
            console.log(e.nativeEvent.path[0].value);
            if (e.nativeEvent.path[0].value == '') {
                // 文本框为空
                // 查找按钮置灰
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
        // 记录搜索结果是否为空
        this.result_list_emty = (type) => {
            console.log('App :result_list_emty');
            // console.log(type);
            // console.log(this.state['result_list_emty']);
            // 状态有变化时才更新 UI
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
        // code.ts 发来消息
        onmessage = (event) => {
            console.log('onmessage');
            console.log(event);
            // 搜索完毕
            if (event.data.pluginMessage['type'] == 'find') {
                var target_Text_Node = event.data.pluginMessage.target_Text_Node;
                console.log('code.ts: onmessage find');
                // console.log(target_Text_Node);
                if (target_Text_Node == {}) {
                    target_Text_Node == [];
                }
                this.setState({
                    search_results_list: target_Text_Node,
                    list_state: 'find'
                });
                if (target_Text_Node == undefined || target_Text_Node.length == 0) {
                    // 空数据
                    this.result_list_emty(true); // 替换按钮置灰
                }
                else if (target_Text_Node.length) {
                    this.result_list_emty(false);
                }
            }
            // 开始搜索
            if (event.data.pluginMessage['type'] == 'find_loading') {
                console.log('code.js onmessage find_loading');
                this.setState({
                    list_state: 'find_loading'
                });
            }
            // 替换
            if (event.data.pluginMessage['type'] == 'replace') {
                console.log('ui.tsx:onmessage');
                console.log(event.data.pluginMessage['type']);
                this.setState({
                    list_state: 'replace'
                });
                this.result_list_emty(true);
            }
            // Figma 选中的图层发生变化
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
        // console.log(note_list);
        // console.log(this.state);
        // console.log(this.state.findButtonDisable);
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
        // 搜索文本框的提示文字
        var input_placeholder;
        if (this.state.selectionPage) {
            // 在当前页面内搜索
            input_placeholder = 'Search in the current page';
        }
        else {
            // 在选中范围内搜索
            input_placeholder = 'Search in the selected layer';
        }
        return (React.createElement("div", null,
            React.createElement("div", { id: 'topBox' },
                React.createElement("div", { className: 'inputBox' },
                    React.createElement("div", null,
                        React.createElement("input", { name: 'find', onInput: this.onFindInputChange, placeholder: input_placeholder, onKeyPress: this.onInputEnter, ref: this.keywordRef }),
                        findButton)),
                React.createElement("div", { className: 'inputBox' },
                    React.createElement("div", null,
                        React.createElement("input", { name: 'replace', placeholder: 'Replace', ref: this.replace_word_Ref, onKeyPress: this.onInputEnter }),
                        replaceButton))),
            React.createElement(SearchResultsList, { find_loading: this.state.find_loading, result_list_emty: this.result_list_emty, list_state: this.state.list_state, data: this.state.search_results_list })));
    }
}
ReactDOM.render(React.createElement(App, null), document.getElementById('react-page'));
