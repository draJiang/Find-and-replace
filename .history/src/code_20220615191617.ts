/// <reference path="../node_modules/@figma/plugin-typings/index.d.ts" />
let target_Text_Node: Array<any> = []         // 存储符合搜索条件的 TEXT 图层
let loaded_fonts: Array<FontName> = []        // 已加载的字体列表
let fileType = figma.editorType               // 当前 figma 文件类型：figma/figjam
let hasMissingFontCount = 0                   // 替换时记录不支持字体的数量

let seting_Aa = false                         // 是否区分大小写
let find_all = false                          // 是否搜索整个文档

let req_cout = 0                              // 搜索结果数量
let node_list = []                            // 存储所有 TEXT 图层

let currentPage = figma.currentPage           // 存储当前页面

//@ts-ignore
figma.skipInvisibleInstanceChildren = true    // 忽略隐藏的图层

console.log('2022-06-15 17:38');



// 显示 UI
//@ts-ignore
figma.showUI(__html__, { themeColors: true, width: 300, height: 400 })

// 读取用户的设置记录
figma.clientStorage.getAsync('find_all').then(find_all_value => {
  console.log(find_all_value);
  find_all = find_all_value

  figma.clientStorage.getAsync('seting_Aa').then(seting_Aa_value => {
    console.log(seting_Aa_value);
    seting_Aa = seting_Aa_value

    // 将设置记录发送给 UI
    figma.ui.postMessage({ 'type': 'getClientStorage', 'done': true, 'data': { 'seting_Aa': seting_Aa, 'find_all': find_all } });

  })

})


// 获取是否选中图层
onSelectionChange()

// 绑定 Figma 图层选择变化事件
figma.on("selectionchange", () => { onSelectionChange() })

// 选中的页面发生变化
figma.on("currentpagechange", () => {
  onCurrentpagechange()
})

// UI 发来消息
figma.ui.onmessage = msg => {

  // UI 中点击了「搜索」按钮
  if (msg.type === 'search') {

    console.log('search');

    // 记录运行时长
    let start = new Date().getTime()
    let find_start = new Date().getTime()

    // 执行搜索
    find(msg.data)

    let done = new Date().getTime()
    console.log('》》》》》》》》》》find:' + (done - find_start).toString());

    let toHTML    // 存储要发给 ui.tsx 的数据

    setTimeout(() => {

      let findKeyWord_start = new Date().getTime()
      // 在文本图层中匹配包含关键字的图层
      toHTML = findKeyWord(node_list, msg.data.keyword)
      let findKeyWord_end = new Date().getTime()
      console.log('》》》》》》》》》》findKeyWord:' + (findKeyWord_end - findKeyWord_start).toString());



    }, 20)


    setTimeout(() => {
      setTimeout(() => {

        // 将搜索数据发送给 ui.tsx
        figma.ui.postMessage({ 'type': 'find', 'done': true, 'target_Text_Node': toHTML })

        console.log('Find end,count:');

        console.log(req_cout);
        // figma.ui.postMessage({ 'type': 'done' })

        let end = new Date().getTime()
        console.log('》》》》》》》》》》' + msg.data.keyword + ':' + (end - start).toString() + ' count:' + req_cout.toString());
        if (req_cout > 30) {
          figma.ui.resize(300, 540)
        }


      }, 30)
    }, 40)

  }

  // UI 中点击搜索结果项
  if (msg.type === 'listOnClik') {

    let msg_data = msg['data']
    let targetNode

    // 搜索结果是否在当前页面
    let click_obj_target_page_id = msg_data['page']

    if (currentPage['id'] != click_obj_target_page_id) {
      // 点击对象不在当前页面，跳转到对应页面
      let document_children = figma.root.children
      let document_children_length = document_children.length

      for (let index = document_children_length - 1; index > -1; index--) {

        if (document_children[index]['id'] == click_obj_target_page_id) {
          figma.currentPage = document_children[index]
          break;
        }

      }

    }


    // 遍历搜索结果
    let len = target_Text_Node.length
    for (let i = len - 1; i > -1; i--) {

      if (target_Text_Node[i]['node'].id == msg_data['item']) {
        // 找到用户点击的图层

        targetNode = target_Text_Node[i]['node']
        // Figma 视图定位到对应图层
        figma.viewport.scrollAndZoomIntoView([targetNode]);
        // Figma 选中对应文本
        figma.currentPage.selectedTextRange = { 'node': targetNode, 'start': msg_data['start'], 'end': msg_data['end'] }

        break
      }

    }

  }

  // UI 中点击了「替换」按钮
  if (msg.type === 'replace') {
    console.log('code.ts replace');
    // 执行替换
    replace(msg).then(() => {

      setTimeout(() => {
        console.log('code.ts replace done');
        // 替换完毕，通知 UI 更新
        // figma.ui.postMessage({ 'type': 'replace', 'done': true, 'hasMissingFontCount': hasMissingFontCount });
      }, 100);

    })

  }

  // UI 中进行搜索设置
  if (msg.type === 'handle_seting_click') {
    switch (msg['data']['type']) {
      case 'seting_Aa':
        seting_Aa = msg['data']['data']['checked']
        break;
      case 'find_all':
        find_all = msg['data']['data']['checked']
        break;
      default:
        break;
    }

    // 将最近一次设置记录下来
    figma.clientStorage.setAsync('find_all', find_all)
    figma.clientStorage.setAsync('seting_Aa', seting_Aa)

  }

}

// 加载字体
async function myLoadFontAsync(text_layer_List) {
  console.log('myLoadFontAsync:');
  // console.log(text_layer_List);


  for (let layer of text_layer_List) {
    if (layer['node']['characters'].length == 0) {
      continue
    }
    // console.log('----------');
    // 加载字体
    // console.log(layer);

    let fonts = layer['node'].getRangeAllFontNames(0, layer['node']['characters'].length)
    // console.log('fonts:');
    // console.log(fonts);

    for (let font of fonts) {

      let bingo = false
      for (let loaded_font of loaded_fonts) {
        if (loaded_font['family'] == font['family'] && loaded_font['style'] == font['style']) {
          bingo = true
          break
        }
      }
      // console.log(bingo);

      if (bingo) {
        continue
      } else {

        // 字体是否支持
        if (layer['node'].hasMissingFont) {
          // 不支持
          console.log('hasMissingFont');

        } else {
          // 支持
          loaded_fonts.push(font)
          console.log('loadFontAsync');
          await figma.loadFontAsync(font)
        }

      }

    }

  }
  // console.log(myFont);
  // await figma.loadFontAsync(myFont)

  return 'done'
}

// 找出所有文本图层
function find(data) {
  console.log('conde.ts:find:');
  // console.log(figma.currentPage);

  // 清空历史搜索数据，重新搜索
  target_Text_Node = []


  if (find_all) {
    //搜索整个文档

    //@ts-ignore
    let selection = figma.root.children

    node_list = []                                // 存储所有 TEXT 图层
    let node_list_temp
    let json_data_temp
    let len = selection.length

    for (let i = 0; i < len; i++) {

      node_list_temp = []

      setTimeout(() => {

        // 如果图层下没有子图层
        //@ts-ignore
        if (selection[i].children == undefined) {

        } else {

          // 获取文本图层

          //@ts-ignore
          node_list_temp = selection[i].findAllWithCriteria({ types: ['TEXT'] })




          json_data_temp = { 'page': selection[i]['name'], 'page_id': selection[i]['id'], 'node_list': node_list_temp }
          node_list.push(json_data_temp)

        }

      }, 10);

    }


  } else {
    // 当前选中的图层
    let selection = figma.currentPage.selection

    // 当前未选中图层，则在当前页面搜索
    if (selection.length == 0) {

      selection = figma.currentPage.children

    } else {
      // 当前有选中图层，则在选中的图层中搜索
      // 在当前选中的图层中，搜索文本图层
    }


    node_list = []               // 存储所有 TEXT 图层
    // let children_list = []    // 拆分图层，逐个搜索，避免界面长时间挂起

    let len = selection.length
    let node_list_temp = []
    let json_data_temp

    // 遍历范围内的图层，获取 TEXT 图层
    //@ts-ignore
    figma.skipInvisibleInstanceChildren = true    // 忽略隐藏的图层
    for (let i = 0; i < len; i++) {

      setTimeout(() => {
        // 如果图层本身就是文本图层
        if (selection[i].type == 'TEXT') {

          node_list_temp.push(selection[i])

        } else {
          // 如果图层下没有子图层
          //@ts-ignore
          if (selection[i].children == undefined) {

          } else {

            // 获取文本图层

            //@ts-ignore
            node_list_temp = node_list_temp.concat(selection[i].findAllWithCriteria({ types: ['TEXT'] }))


          }

        }

        node_list = [{ 'page': figma.currentPage['name'], 'page_id': figma.currentPage['id'], 'node_list': node_list_temp }]

      }, 10);

    }


  }



  // return node_list

}

// 搜索：在文本图层中，匹配关键字
function findKeyWord(node_list, keyword) {

  console.log('func findKeyWord begin');

  req_cout = 0                    // 搜索结果数量

  let data_item_list = []
  let data_temp
  let node                        // 记录遍历到的图层
  let len = node_list.length
  let my_progress = 0             // 进度信息

  // 忽略大小写
  if (seting_Aa != true) {
    keyword = keyword.toLowerCase()
  }

  // console.log('keyword:');
  // console.log(keyword);
  let node_len_sum = 0
  node_list.forEach(item => {
    node_len_sum += item['node_list'].length
  });

  for (let i = 0; i < len; i++) {
    let list_length = node_list[i]['node_list'].length

    for (let j = 0; j < list_length; j++) {

      setTimeout(() => {
        my_progress++
        figma.ui.postMessage({ 'type': 'find', 'done': false, 'my_progress': { 'index': my_progress, 'total': node_len_sum } });


        node = node_list[i]['node_list'][j]
        let node_characters

        // 忽略大小写
        if (seting_Aa != true) {
          node_characters = node['characters'].toLowerCase()
        } else {
          node_characters = node['characters']
        }


        if (node_characters.indexOf(keyword) > -1) {
          // 找到关键词(忽略大小写)

          // 判断祖先图层的状态，包括隐藏、锁定、组件、实例属性
          let this_parent
          let ancestor_isVisible = true
          let ancestor_isLocked = false
          let ancestor_type = ''              // 组件/实例/其他



          if (node.locked == true) {
            ancestor_isLocked = true
          }
          if (node.visible == false) {
            ancestor_isVisible = false
          }

          if (ancestor_isVisible == false || ancestor_isLocked == true) {
            // 如果图层本身就是锁定或隐藏状态
          } else {
            // 获取祖先元素的状态
            this_parent = node.parent
            while (this_parent.type != 'PAGE') {

              if (this_parent.locked == true) {
                ancestor_isLocked = true
              }
              if (this_parent.visible == false) {
                ancestor_isVisible = false
              }

              if (this_parent.type == 'COMPONENT') {
                ancestor_type = 'COMPONENT'
              }
              if (this_parent.type == 'INSTANCE') {
                ancestor_type = 'INSTANCE'
              }

              if ((ancestor_isVisible == false || ancestor_isLocked == true) && ancestor_type != '') {
                break
              } else {
                this_parent = this_parent.parent
              }
            }
          }



          // 单个图层的数据，存储到 target_Text_Node 中，拥有后续的替换工作
          target_Text_Node.push({ 'node': node, 'ancestor_isVisible': ancestor_isVisible, 'ancestor_isLocked': ancestor_isLocked, 'ancestor_type': ancestor_type })

          // 构建数据，传送给 UI
          let position = 0
          let index = 0
          let keyword_length = keyword.length

          while (index >= 0) {
            // 由于单个 TEXT 图层内可能存在多个符合条件的字符，所以需要循环查找
            index = node_characters.indexOf(keyword, position)

            if (index > -1) {
              // 将查找的字符起始、终止位置发送给 UI

              // 每个关键字的数据
              data_temp = { 'page_name': node_list[i]['page'], 'page_id': node_list[i]['page_id'], 'id': node.id, 'characters': node.characters, 'start': index, 'end': index + keyword.length, 'hasMissingFont': node.hasMissingFont, 'ancestor_type': ancestor_type }

              if (req_cout < 20) {
                // 如果已经有搜索结果，则先发送一部分显示在 UI 中，提升搜索加载状态的体验
                figma.ui.postMessage({ 'type': 'find', 'done': false, 'my_progress': { 'index': my_progress, 'total': node_len_sum }, 'target_Text_Node': [data_temp] })

              } else {
                data_item_list.push(data_temp)
              }

              // 统计搜索结果数量
              req_cout++
              // 设置查找目标字符串的偏移
              position = index + keyword_length

            } // if
          } // while
        } // if (node['characters'].indexOf(keyword) > -1)
      }, 10); // setTimeout

    }

  }

  return data_item_list
}

// 替换
async function replace(data) {
  console.log('replace');
  // console.log(data);
  // console.log(target_Text_Node);


  // 如果被替换的字符是 '' 则会陷入死循环，所以要判断一下
  if (data.data.keyword == '') {
    figma.notify('Please enter the characters you want to replace')
    return
  }


  myLoadFontAsync(target_Text_Node).then(() => {
    hasMissingFontCount = 0
    let len = target_Text_Node.length

    let my_progress = 0                           // 进度信息
    let keyword = data.data.keyword               // 关键字
    let newCharacters = data.data.replace_word    // 需要替换成以下字符

    // 忽略大小写
    if (seting_Aa != true) {
      keyword = keyword.toLowerCase()
    }

    setTimeout(() => {
      for (let i = len; i--;) {

        setTimeout(() => {

          my_progress++
          // console.log(my_progress);
          // figma.ui.postMessage({ 'type': 'replace', 'done': false, 'my_progress': { 'index': my_progress, 'total': len},'hasMissingFontCount':hasMissingFontCount  });

          if (target_Text_Node[i]['ancestor_isVisible'] == false || target_Text_Node[i]['ancestor_isLocked'] == true) {
            // 忽略隐藏、锁定的图层
          } else {

            // console.log(target_Text_Node[i]['node']['fontName']);

            // console.log(target_Text_Node[i]['node'].hasMissingFont);

            if (target_Text_Node[i]['node'].hasMissingFont) {
              // 字体不支持
              // console.log('hasMissingFont');
              // console.log(hasMissingFontCount);
              hasMissingFontCount += 1

            } else {

              let textStyle = target_Text_Node[i]['node'].getStyledTextSegments(['indentation', 'listOptions'])
              // console.log('textStyle:');
              // console.log(textStyle);

              let offsetStart = 0
              let offsetEnd = 0         // 记录修改字符后的索引偏移数值
              let styleTemp = []        // 记录每个段落样式在修改后的样式索引（在替换完字符后需要设置回之前的样式）
              let last_offsetEnd = 0    // 记录上一个段落的末尾索引

              // 替换目标字符
              textStyle.forEach(element => {

                // console.log(element);

                let position = 0
                let element_characters = element.characters
                let index

                if (seting_Aa != true) {
                  element_characters = element_characters.toLowerCase()
                }

                // 由于单个段落内可能存在多个符合条件的字符，所以需要循环查找
                while (true) {

                  // 获取匹配到的字符的索引
                  index = element_characters.indexOf(keyword, position)

                  if (index > -1) {
                    // 有匹配的字符

                    // 记录新字符需要插入的位置
                    let insertStart = index + keyword.length + element['start']
                    // console.log('insertStart:' + insertStart.toString());



                    // 在索引后插入新字符
                    target_Text_Node[i]['node'].insertCharacters(insertStart + offsetEnd, newCharacters)
                    // 根据索引删除旧字符
                    target_Text_Node[i]['node'].deleteCharacters(index + element['start'] + offsetEnd, insertStart + offsetEnd)

                    // 记录偏移数值
                    // offsetStart = last_offsetEnd
                    offsetEnd += newCharacters.length - keyword.length


                    // console.log('while offsetStart:' + offsetStart.toString());
                    // console.log('while offsetEnd:' + offsetEnd.toString());

                    // 记录检索到目标字符的索引，下一次 while 循环在此位置后开始查找
                    position = index + keyword.length

                  } else {
                    // 没有匹配的字符
                    break
                  } // else

                }// while

                // 将单个段落的缩进、序号样式记录到数组内
                styleTemp.push({ 'start': last_offsetEnd, 'end': element['end'] + offsetEnd, 'indentation': element['indentation'] > 0 ? element['indentation'] : 0, 'listOptions': element['listOptions'] })

                last_offsetEnd = element['end'] + offsetEnd

                // // 设置缩进
                // target_Text_Node[i]['node'].setRangeIndentation(element['start'] + offsetStart, element['end'] + offsetEnd, element['indentation'] > 0 ? element['indentation'] - 1 : element['indentation'])
                // // 设置序号
                // target_Text_Node[i]['node'].setRangeListOptions(element['start'] + offsetStart, element['end'] + offsetEnd, element['listOptions'])

              });// textStyle.forEach

              // 设置缩进、序号
              // styleTemp 记录了每个段落的缩进、序号样式，遍历数组使得修改字符后的文本图层样式不变
              styleTemp.forEach(element => {
                // console.log(element);
                // console.log(target_Text_Node[i]['node']);

                // 如果文本为空，则不支持设置样式（会报错）
                if (target_Text_Node[i]['node'].characters != '' && element['end'] > element['start']) {
                  // console.log(element);
                  // console.log(target_Text_Node[i]['node']);
                  target_Text_Node[i]['node'].setRangeListOptions(element['start'], element['end'], element['listOptions'])
                  target_Text_Node[i]['node'].setRangeIndentation(element['start'], element['end'], element['indentation'])
                }
              });

            }// else

          }// else

          let is_done = false

          if (my_progress >= len) {
            console.log('my_progress==len-1');

            // console.log(my_progress);
            // console.log(len);

            is_done = true
          } else {


          }

          figma.ui.postMessage({ 'type': 'replace', 'done': is_done, 'my_progress': { 'index': my_progress, 'total': len }, 'hasMissingFontCount': hasMissingFontCount });

        }, 10)

      }
    }, 0);


  })


  // resolve('1')
}// async function replace

// Figma 图层选择变化时，通知 UI 显示不同的提示
function onSelectionChange() {
  console.log('onSelectionChange');

  var selection = figma.currentPage.selection
  // 当前未选中图层，则在当前页面搜索
  if (selection.length == 0) {
    figma.ui.postMessage({ 'type': 'onSelectionChange', 'selectionPage': true })
  } else {
    figma.ui.postMessage({ 'type': 'onSelectionChange', 'selectionPage': false })
  }
}

function onCurrentpagechange() {
  // console.log(figma.currentPage);
  currentPage = figma.currentPage
  // figma.ui.postMessage({ 'type': 'onCurrentpagechange', 'currentPage': figma.currentPage['id'] })
}

