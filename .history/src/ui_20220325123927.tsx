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

    // 无进度信息
    if (this.props.progress_info == undefined) {
      return (
        <div className="modal">
          < div className=" icon icon--spinner icon--spin " > </ div >
          <div>loading…</div>
        </div>
      )
    } else {
      // 有进度信息
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
          {progress_info}
        </div>
      )

    }

  }

}

class SearchResultsList extends React.Component

  <
  {
    data?: Array<object>;
    my_progress?: Array<object>;
    list_state?: string;
    result_list_emty?: Function;
    done?: boolean;
    hasMissingFontCount?: number;
  },
  {
    data?: Array<object>;
    my_progress?: Array<object>;
    list_state?: string;
    result_list_emty?: Function;
    done?: boolean;
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
    // console.log('resultList render:');

    // console.log(this.props);
    var list = this.props.data

    // 搜索加载状态
    // if (this.props['done'] == false && this.props['list_state'] != 'find') {
    //   console.log('搜索加载状态');

    //   console.log(this.props);
    //   return (
    //     <div>
    //       <Loading />
    //     </div>
    //   )
    // }




    // 替换
    if (this.props['list_state'] == 'replace') {


      // console.log(this.props);


      if (this.props['done'] || this.props.my_progress['index'] == this.props.my_progress['total']) {
        // 替换完毕
        let info = this.props['hasMissingFontCount'] <= 0 ? <div className='main_info'>✅ Replaced</div> : <div className='main_info'>ℹ️ {this.props['hasMissingFontCount']} fail because the font is not supported</div>
        return (
          <div className='find_result_list_info'>
            <div>
              {info}
              <div className='minor_info'>Ignored locked, hidden layers</div>
            </div>
          </div>
        )
      } else {
        // 替换中，显示加载状态
        return (
          <div className='find_result_list_info'>
            <Loading progress_info={this.props.my_progress} />
          </div>
        )
      }


    }

    // 搜索
    if (this.props['list_state'] == 'find') {

      // 空数据
      if (this.props['done'] == true && (list == undefined || list.length == 0)) {

        // this.result_list_emty(true)
        return (
          <div className='find_result_list_info'>😅 No results found</div>
        )
      } else if (list.length) {

      }

      // 渲染搜索结果列表
      list.forEach((node) => {

        let this_start = node['start'] - 30 // 关键词前 x 个字符开始截取
        let ellipsis = node['end'] + 30 < node['characters'].length ? true : false

        if (this_start < 0) {
          // 关键词前不足 14 个字符时，从头开始截取
          this_start = 0
        }

        if (node['characters'].indexOf('<span class="heightLight">') < 0) {

          // 关键字高亮显示
          node['characters'] = node['characters'].substring(this_start, node['start']) + '<span class="heightLight">' + node['characters'].substring(node['start'], node['end']) + '</span>' + node['characters'].substring(node['end'], node['end'] + 30)

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
          // let typeIcon = '<span title="Located within the component" class="typeIcon">C</span>'
          let typeIcon = '<span class="typeIcon icon icon--component"></span>'
          node['characters'] = typeIcon + node['characters']
        }
        if (node['ancestor_type'] == 'INSTANCE' && node['characters'].indexOf('typeIcon') < 0) {
          // let typeIcon = '<span title="Located within the instance" class="typeIcon">I</span>'
          let typeIcon = '<span class="typeIcon icon icon--instance"></span>'
          node['characters'] = typeIcon + node['characters']
        }

      })

      const listItems = list.map((node, index) =>

        <li className='resultItem' onClick={this.listItemHandleClick.bind(node)} key={node['id'] + ':' + index.toString()} dangerouslySetInnerHTML={{ __html: node['characters'] }} ></li>

      )

      // 已搜索完毕
      if (this.props['done']) {
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
            <Loading progress_info={this.props.my_progress} />

            {/* 搜索结果列表 */}
            <div className="find_result_list list_disable">{listItems}</div>
          </div>
        )
      }


    }

    // 页面载入时的默认信息
    return (


      <div>

        {/* <Loading progress_info={this.props.my_progress} /> */}

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
      done: true,                         // 搜索是否完成
      hasMissingFontCount: 0,
      show_seting_tips: false,             // 是否显示浮层
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

      // 处理搜索结果
      var target_Text_Node = event.data.pluginMessage.target_Text_Node
      if (target_Text_Node == {} || target_Text_Node == undefined) {
        target_Text_Node = []
      }

      // console.log('ui.tsx target_Text_Node:');

      // 搜索
      if (event.data.pluginMessage['type'] == 'find') {

        if (event.data.pluginMessage['done']) {
          // 搜索完毕

          this.setState({
            //@ts-ignore
            search_results_list: this.state.search_results_list.concat(target_Text_Node),
            list_state: 'find',
            done: event.data.pluginMessage['done']

          })
          //@ts-ignore
          if (this.state.search_results_list == undefined || this.state.search_results_list.length == 0) {
            // 空数据
            this.result_list_emty(true)         // 替换按钮置灰
          } else {
            this.result_list_emty(false)        // 替换按钮激活
          }

        } else {
          // 搜索中
          this.setState({
            //@ts-ignore
            search_results_list: this.state.search_results_list.concat(target_Text_Node),
            list_state: 'find',
            done: event.data.pluginMessage['done'],
            // 进度信息
            my_progress: event.data.pluginMessage['my_progress']

          })

        }



      }

      // 替换
      if (event.data.pluginMessage['type'] == 'replace') {
        // console.log(event.data.pluginMessage);

        if (event.data.pluginMessage['done']) {
          // 替换完毕
          this.setState({
            list_state: 'replace',
            done: event.data.pluginMessage['done'],
            hasMissingFontCount: event.data.pluginMessage['hasMissingFontCount']
          })
        } else {
          // 替换中
          this.setState({
            list_state: 'replace',
            hasMissingFontCount: event.data.pluginMessage['hasMissingFontCount'],
            done: event.data.pluginMessage['done'],
            // 进度信息
            my_progress: event.data.pluginMessage['my_progress']
          })

        }



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
      list_state: 'find',
      done: false,
      my_progress: { 'index': 0, 'total': 100 },
      search_results_list: []    // 每次搜索清空历史记录
    }, () => {

      // 放在 timeout 内是为了避免阻塞 UI 导致加载状态无法显示
      setTimeout(() => {
        const keyword = this.keyword.value
        const replace_word = this.replace_word.value
        parent.postMessage({ pluginMessage: { type: 'search', data: { 'keyword': keyword, 'replace_word': replace_word } } }, '*')
      }, 10)
    })

  }

  // 替换
  onReplace = () => {
    this.setState({
      list_state: 'replace',
      done: false,
      my_progress: { 'index': 0, 'total': 100 },
    })

    setTimeout(() => {
      console.log('onReplace');
      const keyword = this.keyword.value
      const replace_word = this.replace_word.value
      parent.postMessage({ pluginMessage: { type: 'replace', data: { 'keyword': keyword, 'replace_word': replace_word } } }, '*')
    }, 0);

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
      // 搜索文本框为空

      // 查找、替换按钮置灰
      this.setState({
        findButtonDisable: true,
        replaceButtonDisable: true
      })
    } else {
      this.setState({
        findButtonDisable: false,
      })

      //@ts-ignore
      // if(this.state.result_list_emty==false){
      //   this.setState({
      //     replaceButtonDisable: false,
      //   })
      // }

    }

  }

  // 设置按钮点击
  handle_setingIcon_click = () => {
    console.log('handle_setingIcon_click');

    this.setState({
      //@ts-ignore
      show_seting_tips: !this.state.show_seting_tips
    })

  }

  // 隐藏设置浮层
  hidden_seting_tips = (nativeEvent) => {

    let target_id = nativeEvent['nativeEvent']['target']['id']
    let target_className = nativeEvent['nativeEvent']['target']['className']

    if (target_id != 'find_seting_icon' && target_className != 'seting_tips' && target_className.indexOf('checkbox') < 0) {

      console.log('hidden_seting_tips');

      this.setState({
        //@ts-ignore
        show_seting_tips: false
      })
    }
  }

  // 设置浮层内的设置项点击
  handle_seting_click = (nativeEvent) => {
    console.log('handle_seting_click');
    console.log(nativeEvent);

    let seting_type = nativeEvent['nativeEvent']['target']['id']
    // 区分大小写
    if (seting_type == 'seting_Aa') {



    }

    // 搜索整个文档

    // 搜索隐藏图层

    // ……

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

    // 搜索结果为空 或 搜索文本框为空
    if (this.state.result_list_emty || this.keyword.value == '') {
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

    let seting_tips = <div></div>

    if (this.state.show_seting_tips) {
      seting_tips =
        <div className='seting_tips'>
          <div className="checkbox">
            <input onClick={this.handle_seting_click} id="seting_Aa" type="checkbox" className="checkbox__box" />
            <label htmlFor="seting_Aa" className="checkbox__label">111LabelLabelLabelLabel</label>
          </div>
          <div className="checkbox">
            <input onClick={this.handle_seting_click} id="uniqueId" type="checkbox" className="checkbox__box" />
            <label htmlFor="uniqueId" className="checkbox__label">222LabelLabelLabelLabel</label>
          </div>
        </div>
    }

    return (
      <div className='box' onClick={this.hidden_seting_tips}>

        {/* 顶部表单区域 */}
        <div id='topBox'>
          <div className='inputBox'>
            <div>
              <input name='find' onInput={this.onFindInputChange} placeholder={input_placeholder} onKeyPress={this.onInputEnter} ref={this.keywordRef} />
              <div id='find_seting_icon' onClick={this.handle_setingIcon_click} className="icon icon--ellipses"></div>
            </div>
            {findButton}
          </div>
          <div className='inputBox'>
            <div>
              <input name='replace' placeholder='Replace' ref={this.replace_word_Ref} onKeyPress={this.onInputEnter} />
            </div>
            {replaceButton}
          </div>
        </div>

        {/* 搜索结果列表 */}
        <SearchResultsList my_progress={this.state.my_progress} done={this.state.done} result_list_emty={this.result_list_emty} list_state={this.state.list_state} hasMissingFontCount={this.state.hasMissingFontCount} data={this.state.search_results_list} />

        {/* 设置浮层 */}
        <div className='seting_tips'>
          <div className="checkbox">
            <input onClick={this.handle_seting_click} id="seting_Aa" type="checkbox" className="checkbox__box" />
            <label htmlFor="seting_Aa" className="checkbox__label">111LabelLabelLabelLabel</label>
          </div>
          <div className="checkbox">
            <input onClick={this.handle_seting_click} id="uniqueId" type="checkbox" className="checkbox__box" />
            <label htmlFor="uniqueId" className="checkbox__label">222LabelLabelLabelLabel</label>
          </div>
        </div>

      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('react-page'))