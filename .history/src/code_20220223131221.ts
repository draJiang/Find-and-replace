/// <reference path="../node_modules/@figma/plugin-typings/index.d.ts" />
let target_Text_Node: Array<any> = [] // 存储符合搜索条件的 TEXT 图层
let loaded_fonts: Array<FontName> = []
let fileType = figma.editorType

let req_cout = 0
let node_list = []                      // 存储所有 TEXT 图层
let toHTML = []                         // 存储传送给 UI 的符合搜索条件的 TEXT 图层信息

console.log('2022-02-23');

figma.showUI(__html__, { width: 300, height: 340 })

// console.log('hello2')
onSelectionChange()

// 绑定 Figma 图层选择变化事件
figma.on("selectionchange", () => { onSelectionChange() })

// UI 发来消息
figma.ui.onmessage = msg => {

  // UI 中点击了「搜索」按钮
  if (msg.type === 'search') {

    // figma.ui.postMessage({ 'type': 'find_loading' })

    console.log('search');
    // console.log(msg);

    let start = new Date().getTime()

    let find_start = new Date().getTime()

    // 执行搜索
    find(msg.data)

    let find_end = new Date().getTime()
    console.log('》》》》》》》》》》find:' + (find_end - find_start).toString());
    // console.log('figma.ui.onmessage node_list&msg');

    // console.log(node_list);
    // console.log(msg.data);


    // console.log('search target_Text_Node:');

    let toHTML

    setTimeout(() => {
      // console.log('findKeyWord begin');
      // console.log(node_list);
      let findKeyWord_start = new Date().getTime()
      toHTML = findKeyWord(node_list, msg.data.keyword)
      let findKeyWord_end = new Date().getTime()
      console.log('》》》》》》》》》》findKeyWord:' + (findKeyWord_end - findKeyWord_start).toString());
      // console.log('findKeyWord end');

    }, 20)


    setTimeout(() => {
      setTimeout(() => {
        // console.log('toHTML:');
        // console.log(toHTML);


        figma.ui.postMessage({ 'type': 'find', 'find_end': true, 'target_Text_Node': toHTML })

        console.log('Find end:');

        // figma.ui.postMessage({ 'type': 'find_end' })



        console.log(req_cout);
        figma.ui.postMessage({ 'type': 'find_end' })

        let end = new Date().getTime()
        console.log('》》》》》》》》》》' + msg.data.keyword + ':' + (end - start).toString());

      }, 30)
    }, 40)

  }

  // UI 中点击搜索结果项
  if (msg.type === 'listOnClik') {
    // console.log('code js:listOnClik:');

    // console.log(msg);

    var targetNode
    // console.log('forEach:');

    // 遍历搜索结果
    for (var i = 0; i < target_Text_Node.length; i++) {
      // console.log(target_Text_Node[i].id);
      // console.log(msg.data.item);
      // console.log(msg.data['item']);

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
    // console.log('replace');
    console.log(msg);
    // 执行替换
    replace(msg)

  }

}

// 查找图层下的文本图层，输入 figma 图层对象，返回找到所有文本图层
function myFindTextAll(node, node_list, ancestor_isLocked?, ancestor_isVisible?) {

  // console.log('myFindAll');
  // console.log(isLocked);

  let locked = false // 存储最终的状态
  let visible = true

  // 如果目标图层本身就是 TEXT 图层
  if (node.type == 'TEXT') {

    // // 文本图层是否锁定、隐藏？
    // if (node.locked) {
    //   // 锁定
    //   locked = true
    // } else {
    //   locked = false
    // }

    // if (node.visible == false) {
    //   // 隐藏
    //   visible = false
    // } else {
    //   visible = true
    // }

    // // 祖先图层的锁定、隐藏状态优先级高
    // if (ancestor_isLocked == true) {
    //   // 祖先是锁定状态
    //   locked = true
    // } else {
    //   // 祖先非锁定状态
    // }

    // if (ancestor_isVisible == false) {
    //   // 祖先是隐藏状态
    //   visible = false
    // } else {
    //   // 祖先非隐藏状态
    // }

    node_list.push(node)
    return node_list
  }
  var thisChildren = node.children

  //  如果当前节点下存在子节点
  if (thisChildren == undefined) {
    // 当前节点无子节点，可能是形状图层
    return node_list
  }


  // if (ancestor_isLocked == true) {
  //   // 祖先是锁定状态
  // } else {
  //   // 祖先非锁定状态
  //   ancestor_isLocked = thisChildren.locked
  // }

  // if (ancestor_isVisible == false) {
  //   // 祖先是隐藏状态
  // } else {
  //   // 祖先非隐藏状态
  //   ancestor_isVisible = thisChildren.visible
  // }

  // 遍历子节点
  for (let i = 0; i < thisChildren.length; i++) {
    // console.log('thisChildren:')
    // console.log(thisChildren);
    if (thisChildren == undefined) {
      console.log('!!!ERRO thisChildren==undefined');

      return node_list
    }
    // 如果节点的类型为 TEXT
    if (thisChildren[i].type == 'TEXT') {


      node_list.push(thisChildren[i])
    } else {
      // 如果不是 TEXT 图层
      // 如果包含子图层
      if (thisChildren[i].children != null) {

        if (thisChildren[i].children.length > 0) {

          // if (ancestor_isLocked == true) {
          //   // 祖先是锁定状态
          // } else {
          //   // 祖先非锁定状态
          //   ancestor_isLocked = thisChildren[i].locked
          // }

          // if (ancestor_isVisible == false) {
          //   // 祖先是隐藏状态
          // } else {
          //   // 祖先非隐藏状态
          //   ancestor_isVisible = thisChildren.visible
          // }

          node_list = myFindTextAll(thisChildren[i], node_list)
        }
      }
    }
  }
  // console.log('node_list:');
  // console.log(node_list);

  return node_list
}

// 加载字体
async function myLoadFontAsync(text_layer_List) {
  // console.log('myLoadFontAsync:');
  // console.log(text_layer_List);



  for (let layer of text_layer_List) {

    // console.log('----------');
    // 加载字体
    // console.log('layer:');
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
  let selection = figma.currentPage.selection



  // 当前未选中图层，则在当前页面搜索
  if (selection.length == 0) {
    // node_list = figma.currentPage.findAll(n => n.type === "TEXT")
    selection = figma.currentPage.children

  } else {
    // 当前有选中图层，则在选中的图层中搜索
    // 在当前选中的图层中，搜索文本图层
  }


  node_list = []
  let findAllWithCriteria_sum = 0
  // 遍历范围内的图层，获取 TEXT 图层
  let len = selection.length
  for (let i = 0; i < len; i++) {

    setTimeout(() => {
      // 如果图层本身就是文本图层
      if (selection[i].type == 'TEXT') {
        node_list.push(selection[i])
        // let bingo_nodes = findKeyWord(node_list, data.keyword)
      } else {
        // 如果图层下没有子图层
        //@ts-ignore
        if (selection[i].children == undefined) {

        } else {
          let start = new Date().getTime()
          //@ts-ignore
          node_list = node_list.concat(selection[i].findAllWithCriteria({ types: ['TEXT'] }))
          // console.log(' find timeout node_list:');
          // console.log(node_list);
          let end = new Date().getTime()
          findAllWithCriteria_sum+=end - start
          console.log('》》》》》》》》》》findAllWithCriteria:' + (end - start).toString())+'sum:'+findAllWithCriteria_sum.toString();

        }

      }
    }, 10);

  }

  // console.log('selection:');
  // console.log(selection);




  return node_list

}

// 替换
async function replace(data) {
  console.log('replace');
  // console.log(data);
  // console.log(target_Text_Node);
  let hasMissingFontCount = 0

  await myLoadFontAsync(target_Text_Node)

  target_Text_Node.forEach(item => {

    // console.log('replace target_Text_Node.forEach:');
    // console.log(item);

    if (item['ancestor_isVisible'] == false || item['ancestor_isLocked'] == true) {
      // 忽略隐藏、锁定的图层
    } else {

      // console.log(item['node']['fontName']);

      // console.log(item['node'].hasMissingFont);

      if (item['node'].hasMissingFont) {
        // 字体不支持
        console.log('hasMissingFont');
        hasMissingFontCount += 1

      } else {

        let textStyle = item['node'].getStyledTextSegments(['indentation', 'listOptions'])
        // console.log('textStyle:');
        // console.log(textStyle);

        let offsetStart = 0
        let offsetEnd = 0         // 记录修改字符后的索引偏移数值
        let styleTemp = []        // 记录每个段落样式在修改后的样式索引（在替换完字符后需要设置回之前的样式）
        let last_offsetEnd = 0    // 记录上一个段落的末尾索引

        // 替换目标字符
        textStyle.forEach(element => {

          let position = 0



          // 由于单个段落内可能存在多个符合条件的字符，所以需要循环查找
          while (true) {

            // 获取匹配到的字符的索引
            var index = element.characters.indexOf(data.data.keyword, position)

            if (index > -1) {
              // 有匹配的字符

              // 记录新字符需要插入的位置
              let insertStart = index + data.data.keyword.length + element['start']
              // console.log('insertStart:' + insertStart.toString());

              // 需要替换成以下字符
              let newCharacters = data.data.replace_word

              // 在索引后插入新字符
              item['node'].insertCharacters(insertStart + offsetEnd, newCharacters)
              // 根据索引删除旧字符
              item['node'].deleteCharacters(index + element['start'] + offsetEnd, insertStart + offsetEnd)

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



          // console.log('offsetStart:' + offsetStart.toString());
          // console.log('offsetEnd:' + offsetEnd.toString());
          // console.log('element:');
          // console.log(element);

          // let thisStart = element['start'] + offsetStart
          // if (thisStart < 0) {
          //   thisStart = 0
          // }
          // if (element['start'] == 0) {
          //   thisStart == 0
          // }

          // 将单个段落的缩进、序号样式记录到数组内
          styleTemp.push({ 'start': last_offsetEnd, 'end': element['end'] + offsetEnd, 'indentation': element['indentation'] > 0 ? element['indentation'] : element['indentation'], 'listOptions': element['listOptions'] })

          last_offsetEnd = element['end'] + offsetEnd

          // // 设置缩进
          // item['node'].setRangeIndentation(element['start'] + offsetStart, element['end'] + offsetEnd, element['indentation'] > 0 ? element['indentation'] - 1 : element['indentation'])
          // // 设置序号
          // item['node'].setRangeListOptions(element['start'] + offsetStart, element['end'] + offsetEnd, element['listOptions'])

        });// textStyle.forEach

        // 设置缩进、序号
        // console.log('设置缩进、序号：');
        // console.log(styleTemp);

        // styleTemp 记录了每个段落的缩进、序号样式，遍历数组使得修改字符后的文本图层样式不变
        styleTemp.forEach(element => {

          item['node'].setRangeListOptions(element['start'], element['end'], element['listOptions'])
          item['node'].setRangeIndentation(element['start'], element['end'], element['indentation'])

        });

      }// else

      // var searchRegExp = new RegExp(data.data.keyword, 'g')
      // // console.log(item);
      // item['node'].characters = item['node'].characters.replace(searchRegExp, data.data.replace_word)

    }// else

  })// target_Text_Node.forEach

  // 替换完毕，通知 UI 更新
  figma.ui.postMessage({ 'type': 'replace', 'hasMissingFontCount': hasMissingFontCount });
  console.log('target_Text_Node:');

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


function findKeyWord(node_list, keyword) {
  console.log('func findKeyWord begin');
  req_cout = 0
  // 在文本图层中，匹配关键字
  let data_item
  let data_item_list = []
  let posted = []
  let data_temp

  let len = node_list.length

  for (let i = 0; i < len; i++) {
    setTimeout(() => {
      let node = node_list[i]
      if (node['characters'].indexOf(keyword) > -1) {
        // 找到关键词

        let this_parent
        let ancestor_isVisible = true
        let ancestor_isLocked = false
        let ancestor_type = ''



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



        data_item = { 'node': node, 'ancestor_isVisible': ancestor_isVisible, 'ancestor_isLocked': ancestor_isLocked, 'ancestor_type': ancestor_type }
        target_Text_Node.push(data_item)

        // 构建数据，传送给 UI
        var position = 0
        while (true) {
          // 由于单个 TEXT 图层内可能存在多个符合条件的字符，所以需要循环查找
          var index = data_item['node'].characters.indexOf(keyword, position)
          // console.log('index:');
          // console.log(index);

          if (index > -1) {
            // 将查找的字符起始、终止位置发送给 UI
            // figma.ui.postMessage({ 'type': 'find', 'target_Text_Node': [{ 'id': data_item['node'].id, 'characters': data_item['node'].characters, 'start': index, 'end': index + keyword.length, 'hasMissingFont': data_item['node'].hasMissingFont }] })
            // console.log('func findKeyWord finded');
            data_temp = { 'id': data_item['node'].id, 'characters': data_item['node'].characters, 'start': index, 'end': index + keyword.length, 'hasMissingFont': data_item['node'].hasMissingFont, 'ancestor_type': data_item['ancestor_type'] }
            if (posted.length < 10) {
              figma.ui.postMessage({ 'type': 'find', 'find_end': false, 'target_Text_Node': [data_temp] })
              posted.push(data_temp)
            } else {
              data_item_list.push(data_temp)
            }

            req_cout += 1
            // console.log('count:' + req_cout.toString());

            // // 加载字体
            // myLoadFontAsync([{ 'id': data_item['node'].id, 'characters': data_item['node'].characters, 'start': index, 'end': index + keyword.length, 'hasMissingFont': data_item['node'].hasMissingFont }])
            position = index + keyword.length

          } else {
            break
          }
        }

        // console.log('postMessage');
        // return { 'node': node_list[j], 'ancestor_isVisible': ancestor_isVisible, 'ancestor_isLocked': ancestor_isLocked }
      }
    }, 10);
  }

  // node_list.forEach(element => {


  // });


  // for (var j = 0; j < node_list.length; j++) {



  // }


  // console.log('find end:');
  // console.log(target_Text_Node);
  console.log('func findKeyWord end');
  // console.log(data_item_list);

  toHTML = data_item_list
  return data_item_list
}