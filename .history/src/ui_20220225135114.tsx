import * as React from 'react'
import * as ReactDOM from 'react-dom'

import '../node_modules/figma-plugin-ds/dist/figma-plugin-ds.css'
import './ui.css'

declare function require(path: string): any

class Loading extends React.Component
<
{
  progress_info?: Array<object>;
},
{
  progress_info?: Array<object>;
}
>
{
  constructor(props) {
    super(props);
    this.state = {
    
    };
  }

  render() {

    if (true) {
      
    }

    let index = this.props.progress_info['index']
    let total = this.props.progress_info['total']
    let progress_info = {

    }
    if (index > 0) {
      progress_info = <div>{Math.floor(index / total * 100).toString() + '%'}</div>

    } else {
      progress_info = <div>loading…</div>
    }

    return (
      <div className="modal">
        < div className=" icon icon--spinner icon--spin " > </ div >
        <div>loading…</div>
      </div>
    )

  }

}

class SearchResultsList extends React.Component

  <
  {
    data?: Array<object>;
    my_progress?: Array<object>;
    list_state?: string;
    result_list_emty?: Function;
    find_end?: boolean;
    hasMissingFontCount?: number;
  },
  {
    data?: Array<object>;
    my_progress?: Array<object>;
    list_state?: string;
    result_list_emty?: Function;
    find_end?: boolean;
    hasMissingFontCount?: number;
  }>
{
  constructor(props) {
    super(props);
    this.state = {
      // data: this.props
    };
  }

  // 搜索结果项点击时
  listItemHandleClick(item) {

    // 通知 code.ts
    parent.postMessage({ pluginMessage: { type: 'listOnClik', data: { 'item': this['id'], 'start': this['start'], 'end': this['end'] } } }, '*')

    // 设置点击对象为「已点」样式
    for (let i = 0; i < item.nativeEvent.path.length; i++) {
      if (item.nativeEvent.path[i].className == 'resultItem') {
        item.nativeEvent.path[i].className += ' clicked'
        break
      }
    }

  }


  // 搜索无结果时，通过此方法通知父组件更新 UI（主要是置灰替换按钮）
  result_list_emty = (type) => {
    this.props.result_list_emty(type)
  }

  render() {

    var list = this.props.data

    // 搜索加载状态
    if (this.props['find_end'] == false && this.props['list_state'] != 'find') {
      console.log('find_end:');

      return (
        <div>
          <Loading />
        </div>
      )
    }

    // 替换完毕
    if (this.props['list_state'] == 'replace') {

      let info = this.props['hasMissingFontCount'] <= 0 ? <div className='main_info'>✅ Replaced</div> : <div className='main_info'>ℹ️ {this.props['hasMissingFontCount']} fail because the font is not supported</div>
      return (
        <div className='find_result_list_info'>
          <div>
            {info}
            <div className='minor_info'>Ignored locked, hidden layers</div>
          </div>
        </div>
      )
    }


    // 搜索
    if (this.props['list_state'] == 'find') {

      // 空数据
      if (this.props['find_end'] == true && (list == undefined || list.length == 0)) {

        // this.result_list_emty(true)
        return (
          <div className='find_result_list_info'>😅 No results found</div>
        )
      } else if (list.length) {

      }

      // 渲染搜索结果列表
      list.forEach((node) => {

        let this_start = node['start'] - 20 // 关键词前 x 个字符开始截取
        let ellipsis = node['end'] + 20 < node['characters'].length ? true : false

        if (this_start < 0) {
          // 关键词前不足 14 个字符时，从头开始截取
          this_start = 0
        }

        if (node['characters'].indexOf('<span class="heightLight">') < 0) {

          // 关键字高亮显示
          node['characters'] = node['characters'].substring(this_start, node['start']) + '<span class="heightLight">' + node['characters'].substring(node['start'], node['end']) + '</span>' + node['characters'].substring(node['end'], node['end'] + 20)

          // 关键词在段落中靠后，则前面加省略号
          if (this_start > 0) {
            node['characters'] = '...' + node['characters']
          }

          // 文本长度过长，则后面加省略号

          if (ellipsis) {
            node['characters'] = node['characters'] + '...'
          }
        }

        let missIcon = '<span title="The fonts are not available,replace is not supported" class="missIcon">A?</span>'
        // 字体若不兼容，则显示 UI 提示
        if (node['hasMissingFont'] && node['characters'].indexOf(missIcon) < 0) {
          node['characters'] += missIcon
        }

        // 字体位于组件或示例内时，显示 UI 提示
        if (node['ancestor_type'] == 'COMPONENT' && node['characters'].indexOf('typeIcon') < 0) {
          let typeIcon = '<span title="Located within the component" class="typeIcon">C</span>'
          node['characters'] += typeIcon
        }
        if (node['ancestor_type'] == 'INSTANCE' && node['characters'].indexOf('typeIcon') < 0) {
          let typeIcon = '<span title="Located within the instance" class="typeIcon">I</span>'
          node['characters'] += typeIcon
        }

      })

      const listItems = list.map((node, index) =>

        <li className='resultItem' onClick={this.listItemHandleClick.bind(node)} key={node['id'] + ':' + index.toString()} dangerouslySetInnerHTML={{ __html: node['characters'] }} ></li>

      )

      // 已搜索完毕
      if (this.props['find_end']) {
        return (
          <div>
            <div className="find_result_list">{listItems}</div>
          </div>
        )


      } else {
        // 还在搜索
        return (
          <div>
            {/* 搜索加载状态提示 */}
            {/* <div className="modal">
              < div className=" icon icon--spinner icon--spin " > </ div >
              {progress_info}
            </div> */}

            <Loading progress_info = {this.props.my_progress} />

            {/* 搜索结果列表 */}
            <div className="find_result_list list_disable">{listItems}</div>
          </div>
        )
      }


    }

    // 页面载入时的默认信息
    return (


      <div>

        <div className="find_result_list list_disable">
          {/* <li className="resultItem">_<span className="heightLight">button</span>--standard</li>
          <li className="resultItem">_<span className="heightLight">button</span>--standard</li>
          <li className="resultItem">_<span className="heightLight">button</span>--standard</li>
          <li className="resultItem">_<span className="heightLight">button</span>--standard</li> */}
        </div>

      </div>

    )

  }
}

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      search_results_list: [],
      list_state: false,
      selectionPage: true,
      findButtonDisable: true,
      replaceButtonDisable: true,
      result_list_emty: true,
      find_end: true,              // 搜索是否完成
      hasMissingFontCount: 0,
      my_progress: {
        'index': 0,
        'total': 100
      }
    };
  }

  keyword: HTMLInputElement
  replace_word: HTMLInputElement

  // 搜索文本框
  keywordRef = (element: HTMLInputElement) => {
    if (element) {
      element.value = ''
      element.focus()
    }
    this.keyword = element
  }

  // 替换文本框
  replace_word_Ref = (element: HTMLInputElement) => {
    if (element) element.value = ''
    this.replace_word = element
  }

  // 组件载入时
  componentDidMount() {

    // code.ts 发来消息
    onmessage = (event) => {

      // 搜索
      if (event.data.pluginMessage['type'] == 'find') {

        var target_Text_Node = event.data.pluginMessage.target_Text_Node

        if (target_Text_Node == {}) {
          target_Text_Node == []
        }

        this.setState({
          //@ts-ignore
          search_results_list: this.state.search_results_list.concat(target_Text_Node),
          list_state: 'find',
          find_end: event.data.pluginMessage['find_end']

        })

        if (target_Text_Node == undefined || target_Text_Node.length == 0) {
          // 空数据
          this.result_list_emty(true)         // 替换按钮置灰
        } else if (target_Text_Node.length) {
          this.result_list_emty(false)        // 替换按钮激活
        }
      }

      // 搜索进度
      if (event.data.pluginMessage['type'] == 'loading') {

        this.setState({
          my_progress: event.data.pluginMessage['my_progress']
        })

      }

      // 替换完毕
      if (event.data.pluginMessage['type'] == 'replace') {

        this.setState({
          list_state: 'replace',
          hasMissingFontCount: event.data.pluginMessage['hasMissingFontCount']
        })

        this.result_list_emty(true)
      }

      // Figma 选中的图层发生变化
      if (event.data.pluginMessage['type'] == 'onSelectionChange') {
        this.setState({
          selectionPage: event.data.pluginMessage['selectionPage']
        })
      }


    }
  }


  // 搜索
  onSearch = () => {
    console.log('设置搜索中状态：');

    this.setState({
      find_end: false,
      my_progress: { 'index': 0, 'total': 100 },
      search_results_list: []    // 每次搜索清空历史记录
    }, () => {
      // const keyword = this.keyword.value
      // const replace_word = this.replace_word.value
      // parent.postMessage({ pluginMessage: { type: 'search', data: { 'keyword': keyword, 'replace_word': replace_word } } }, '*')

      // 放在 timeout 内是为了避免阻塞 UI 导致加载状态无法显示
      setTimeout(() => {
        const keyword = this.keyword.value
        const replace_word = this.replace_word.value
        parent.postMessage({ pluginMessage: { type: 'search', data: { 'keyword': keyword, 'replace_word': replace_word } } }, '*')
      }, 10)
    })

    // setTimeout(() => {
    //   const keyword = this.keyword.value
    //   const replace_word = this.replace_word.value
    //   parent.postMessage({ pluginMessage: { type: 'search', data: { 'keyword': keyword, 'replace_word': replace_word } } }, '*')
    // }, 0)


  }

  // 替换
  onReplace = () => {
    const keyword = this.keyword.value
    const replace_word = this.replace_word.value
    parent.postMessage({ pluginMessage: { type: 'replace', data: { 'keyword': keyword, 'replace_word': replace_word } } }, '*')
  }

  // 文本框输入时
  onInputEnter = (e) => {
    // console.log('enter');
    // console.log(e.nativeEvent);
    // console.log(this);

    // 监听回车键
    if (e.nativeEvent.keyCode == 13) {

      // 搜索
      if (e.nativeEvent.path[0].name == 'find' && e.nativeEvent.path[0].value != '') {
        this.onSearch()
      }

      // 替换
      if (e.nativeEvent.path[0].name == 'replace' && this.state['result_list_emty'] != true) {
        this.onReplace()
      }
    }
  }


  // 文本框值变化（用于搜索框）
  onFindInputChange = (e) => {

    if (e.nativeEvent.path[0].value == '') {
      // 文本框为空

      // 查找按钮置灰
      this.setState({
        findButtonDisable: true,
      })
    } else {
      this.setState({
        findButtonDisable: false,
      })
    }

  }


  // 记录搜索结果是否为空
  result_list_emty = (type) => {

    // 状态有变化时才更新 UI
    if (type != this.state['result_list_emty']) {
      console.log('App :result_list_emty');
      if (type) {
        this.setState({
          result_list_emty: true
        })
      } else {
        this.setState({
          result_list_emty: false
        })
      }
    }
  }

  render(this) {
    // console.log('APP render this.state.search_results_list:');
    var note_list = this.state.search_results_list
    // console.log(note_list);
    // console.log(this.state);
    // console.log(this.state.findButtonDisable);

    if (this.state.findButtonDisable) {
      // 按钮置灰
      var findButton = <button className='buttonDisable' id="search" onClick={this.onSearch}>Find</button>
    } else {
      var findButton = <button id="search" onClick={this.onSearch}>Find</button>
    }

    if (this.state.result_list_emty) {
      // 按钮置灰
      var replaceButton = <button className='buttonDisable' id="replace" onClick={this.onReplace}>Replace</button>
    } else {
      var replaceButton = <button id="replace" onClick={this.onReplace}>Replace</button>
    }

    // 搜索文本框的提示文字，根据是否选中图层显示不同提示
    var input_placeholder
    if (this.state.selectionPage) {
      // 在当前页面内搜索
      input_placeholder = 'Search in the current page'
    } else {
      // 在选中范围内搜索
      input_placeholder = 'Search in the selected layer'
    }

    return (
      <div>

        {/* 顶部表单区域 */}
        <div id='topBox'>
          <div className='inputBox'>
            {/* <p>Find</p> */}
            <div>
              <input name='find' onInput={this.onFindInputChange} placeholder={input_placeholder} onKeyPress={this.onInputEnter} ref={this.keywordRef} />
              {findButton}
            </div>
          </div>
          <div className='inputBox'>
            {/* <p>Replace</p> */}
            <div>
              <input name='replace' placeholder='Replace' ref={this.replace_word_Ref} onKeyPress={this.onInputEnter} />
              {replaceButton}
            </div>
          </div>
        </div>

        {/* 搜索结果列表 */}
        <SearchResultsList my_progress={this.state.my_progress} find_end={this.state.find_end} result_list_emty={this.result_list_emty} list_state={this.state.list_state} hasMissingFontCount={this.state.hasMissingFontCount} data={this.state.search_results_list} />

      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('react-page'))