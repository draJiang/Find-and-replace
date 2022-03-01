/// <reference path="../node_modules/@figma/plugin-typings/index.d.ts" />
let target_Text_Node: Array<any> = []      // 存储符合搜索条件的 TEXT 图层
let loaded_fonts: Array<FontName> = []     // 已加载的字体列表
let fileType = figma.editorType            // 当前 figma 文件类型：figma/figjam
let hasMissingFontCount = 0                // 替换时记录不支持字体的数量

let req_cout = 0                           // 搜索结果数量
let node_list = []                         // 存储所有 TEXT 图层

console.log('2022-02-25');

// 启动插件时显示 UI
figma.showUI(__html__, { width: 300, height: 340 })

// 获取是否选中图层
onSelectionChange()

// 绑定 Figma 图层选择变化事件
figma.on("selectionchange", () => { onSelectionChange() })

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

        console.log('Find end:');

        console.log(req_cout);
        // figma.ui.postMessage({ 'type': 'done' })

        let end = new Date().getTime()
        console.log('》》》》》》》》》》' + msg.data.keyword + ':' + (end - start).toString());

      }, 30)
    }, 40)

  }

  // UI 中点击搜索结果项
  if (msg.type === 'listOnClik') {

    var targetNode
    // console.log('forEach:');

    // 遍历搜索结果
    let len = target_Text_Node.length
    for (var i = 0; i < len; i++) {

      if (target_Text_Node[i]['node'].id == msg.data['item']) {
        // 找到用户点击的图层

        targetNode === target_Text_Node[i]['node']
        // Figma 视图定位到对应图层
        figma.viewport.scrollAndZoomIntoView([target_Text_Node[i]['node']]);
        // Figma 选中对应文本
        figma.currentPage.selectedTextRange = { 'node': target_Text_Node[i]['node'], 'start': msg.data['start'], 'end': msg.data['end'] }

        break
      }

    }

  }

  // UI 中点击了「替换」按钮
  if (msg.type === 'replace') {
    console.log('code.ts replace');
    console.log(msg);
    // 执行替换
    replace(msg)

    setTimeout(() => {

      setTimeout(() => {
        console.log('code.ts replace done');
        // 替换完毕，通知 UI 更新
        figma.ui.postMessage({ 'type': 'replace','done':true, 'hasMissingFontCount': hasMissingFontCount });
      }, 30);


    }, 20);


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
}

// 搜索
function find(data) {
  console.log('conde.ts:find:');
  // console.log(figma.currentPage);

  // 清空历史搜索数据，重新搜索
  target_Text_Node = []
  // 当前选中的图层
  let selection = figma.currentPage.selection



  // 当前未选中图层，则在当前页面搜索
  if (selection.length == 0) {

    selection = figma.currentPage.children

  } else {
    // 当前有选中图层，则在选中的图层中搜索
    // 在当前选中的图层中，搜索文本图层
  }


  node_list = []        // 存储所有 TEXT 图层

  // 遍历范围内的图层，获取 TEXT 图层
  let len = selection.length
  for (let i = 0; i < len; i++) {

    setTimeout(() => {
      // 如果图层本身就是文本图层
      if (selection[i].type == 'TEXT') {

        node_list.push(selection[i])

      } else {
        // 如果图层下没有子图层
        //@ts-ignore
        if (selection[i].children == undefined) {

        } else {

          // 获取文本图层
          //@ts-ignore
          node_list = node_list.concat(selection[i].findAllWithCriteria({ types: ['TEXT'] }))

        }

      }
    }, 10);

  }

  return node_list

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

  hasMissingFontCount = 0

  await myLoadFontAsync(target_Text_Node)
  let len = target_Text_Node.length

  let my_progress = 0             // 进度信息
  for (let i = len; i--;) {


    setTimeout(() => {

      console.log('len:');
      console.log(len);
      console.log('i:');
      console.log(i);
      
      
      
      
      
      my_progress++
      // console.log(my_progress);
      figma.ui.postMessage({ 'type': 'replace','done':false, 'my_progress': { 'index': my_progress, 'total': len } });

      if (target_Text_Node[i]['ancestor_isVisible'] == false || target_Text_Node[i]['ancestor_isLocked'] == true) {
        // 忽略隐藏、锁定的图层
      } else {

        // console.log(target_Text_Node[i]['node']['fontName']);

        // console.log(target_Text_Node[i]['node'].hasMissingFont);

        if (target_Text_Node[i]['node'].hasMissingFont) {
          // 字体不支持
          console.log('hasMissingFont');
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

            let index
            // 由于单个段落内可能存在多个符合条件的字符，所以需要循环查找
            while (true) {

              // 获取匹配到的字符的索引
              index = element.characters.indexOf(data.data.keyword, position)

              if (index > -1) {
                // 有匹配的字符

                // 记录新字符需要插入的位置
                let insertStart = index + data.data.keyword.length + element['start']
                // console.log('insertStart:' + insertStart.toString());

                // 需要替换成以下字符
                let newCharacters = data.data.replace_word

                // 在索引后插入新字符
                target_Text_Node[i]['node'].insertCharacters(insertStart + offsetEnd, newCharacters)
                // 根据索引删除旧字符
                target_Text_Node[i]['node'].deleteCharacters(index + element['start'] + offsetEnd, insertStart + offsetEnd)

                // 记录偏移数值
                // offsetStart = last_offsetEnd
                offsetEnd += data.data.replace_word.length - data.data.keyword.length


                // console.log('while offsetStart:' + offsetStart.toString());
                // console.log('while offsetEnd:' + offsetEnd.toString());

                // 记录检索到目标字符的索引，下一次 while 循环在此位置后开始查找
                position = index + data.data.keyword.length

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

        // var searchRegExp = new RegExp(data.data.keyword, 'g')
        // // console.log(target_Text_Node[i]);
        // item['node'].characters = item['node'].characters.replace(searchRegExp, data.data.replace_word)

      }// else
    }, 10)

  }

}// async function replace

// Figma 图层选择变化时，通知 UI 显示不同的提示
function onSelectionChange() {

  var selection = figma.currentPage.selection
  // 当前未选中图层，则在当前页面搜索
  if (selection.length == 0) {
    figma.ui.postMessage({ 'type': 'onSelectionChange', 'selectionPage': true })
  } else {
    figma.ui.postMessage({ 'type': 'onSelectionChange', 'selectionPage': false })
  }
}

// 在文本图层中，匹配关键字
function findKeyWord(node_list, keyword) {

  // console.log('func findKeyWord begin');
  req_cout = 0                    // 搜索结果数量

  let data_item_list = []
  let data_temp
  let node                        // 记录遍历到的图层
  let len = node_list.length
  let my_progress = 0             // 进度信息

  for (let i = 0; i < len; i++) {
    setTimeout(() => {
      my_progress++
      figma.ui.postMessage({ 'type': 'find','done':false, 'my_progress': { 'index': my_progress, 'total': node_list.length } });


      node = node_list[i]
      if (node['characters'].indexOf(keyword) > -1) {
        // 找到关键词

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
          index = node.characters.indexOf(keyword, position)
          // console.log('index:');
          // console.log(index);

          if (index > -1) {
            // 将查找的字符起始、终止位置发送给 UI

            // 每个关键字的数据
            data_temp = { 'id': node.id, 'characters': node.characters, 'start': index, 'end': index + keyword.length, 'hasMissingFont': node.hasMissingFont, 'ancestor_type': ancestor_type }
            if (req_cout < 10) {
              // 如果已经有搜索结果，则先发送一部分显示在 UI 中，提升搜索加载状态的体验
              figma.ui.postMessage({ 'type': 'find', 'done': false, 'target_Text_Node': [data_temp] })
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

  console.log('func findKeyWord end');

  return data_item_list
}