/// <reference path="../node_modules/@figma/plugin-typings/index.d.ts" />
let target_Text_Node: Array<any> = [] // 存储符合搜索条件的 TEXT 图层
let loaded_fonts: Array<FontName> = []
console.log('2022-02-09');

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
    console.log(msg);

    // 执行搜索
    find(msg.data)
    console.log('search target_Text_Node:');

    console.log(target_Text_Node);

    console.log('console.log(target_Text_Node.length);' + target_Text_Node.length.toString());

    let toUIHTML: any = [] // 存储数据，用于发送给 UI
    if (target_Text_Node.length >= 0) {
      // 如果存在符合搜索条件的 TEXT 图层

      // console.log('target_Text_Node.forEach:');
      target_Text_Node.forEach(item => {

        var position = 0

        // 构建数据，传送给 UI
        while (true) {
          // 由于单个 TEXT 图层内可能存在多个符合条件的字符，所以需要循环查找
          var index = item['node'].characters.indexOf(msg.data.keyword, position)
          // console.log('index:');
          // console.log(index);


          if (index > -1) {
            // 将查找的字符起始、终止位置发送给 UI
            toUIHTML.push({ 'id': item['node'].id, 'characters': item['node'].characters, 'start': index, 'end': index + msg.data.keyword.length, 'hasMissingFont': item['node'].hasMissingFont })
            position = index + msg.data.keyword.length

          } else {
            break
          }
        }


      })
      console.log('if :toUIHTML:');
      // console.log(toUIHTML);


    }

    figma.ui.postMessage({ 'type': 'find', 'target_Text_Node': toUIHTML })
    const loadFont = async () => { myLoadFontAsync(target_Text_Node) }
    loadFont()
  }

  // UI 中点击搜索结果项
  if (msg.type === 'listOnClik') {
    console.log('code js:listOnClik:');

    console.log(msg);

    var targetNode
    console.log('forEach:');

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
  console.log('myLoadFontAsync:');
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
      // console.log('find end load font:');
      // console.log('loaded_fonts:');
      // console.log(loaded_fonts);
      // console.log('font:');
      // console.log(font);

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
  var selection = figma.currentPage.selection

  var node_list = [] // 存储目标值 —— 选中图层中，所有文本图层
  // 当前未选中图层，则在当前页面搜索
  if (selection.length == 0) {
    // node_list = figma.currentPage.findAll(n => n.type === "TEXT")
    selection = figma.currentPage.children
    // node_list = myFindTextAll(figma.currentPage, node_list)
  } else {
    // 当前有选中图层，则在选中的图层中搜索
    // 在当前选中的图层中，搜索文本图层
  }

  for (let i = 0; i < selection.length; i++) {
    // console.log('find:for selection');
    node_list = myFindTextAll(selection[i], node_list)

  }

  // console.log('selection:');
  // console.log(selection);



  console.log('Find end:');
  // console.log(node_list);

  // 在文本图层中，匹配关键字
  for (var j = 0; j < node_list.length; j++) {
    // console.log(node_list[j]['node']);

    if (node_list[j]['characters'].indexOf(data.keyword) > -1) {
      // 找到关键词

      let this_parent
      let ancestor_isVisible = true
      let ancestor_isLocked = false



      if (node_list[j].locked == true) {
        ancestor_isLocked = true
      }
      if (node_list[j].visible == false) {
        ancestor_isVisible = false
      }

      if (ancestor_isVisible == false || ancestor_isLocked == true) {
        // 如果图层本身就是锁定或隐藏状态
      } else {
        // 获取祖先元素的状态
        this_parent = node_list[j].parent
        while (this_parent.type != 'PAGE') {

          if (this_parent.locked == true) {
            ancestor_isLocked = true
          }
          if (this_parent.visible == false) {
            ancestor_isVisible = false
          }

          if (ancestor_isVisible == false || ancestor_isLocked == true) {
            break
          } else {
            this_parent = this_parent.parent
          }
        }
      }


      target_Text_Node.push({ 'node': node_list[j], 'ancestor_isVisible': ancestor_isVisible, 'ancestor_isLocked': ancestor_isLocked })
    }
  }

}

// 替换
async function replace(data) {
  console.log('replace');
  // console.log(data);
  console.log(target_Text_Node);
  let hasMissingFontCount = 0

  target_Text_Node.forEach(item => {

    console.log('replace target_Text_Node.forEach:');
    console.log(item);

    if (item['ancestor_isVisible'] == false || item['ancestor_isLocked'] == true) {
      // 忽略隐藏、锁定的图层
    } else {
      console.log('node:');

      console.log(item['node']['fontName']);

      console.log(item['node'].hasMissingFont);

      if (item['node'].hasMissingFont) {
        // 字体不支持
        console.log('hasMissingFont');
        hasMissingFontCount += 1

      } else {

        let textStyle = item['node'].getStyledTextSegments(['indentation', 'listOptions'])
        console.log(textStyle);
        
        let offsetStart = 0
        let offsetEnd = 0

        // 替换目标字符
        textStyle.forEach(element => {

          let position = 0



          // 由于单个段落内可能存在多个符合条件的字符，所以需要循环查找
          while (true) {
            // 获取匹配到的字符的索引
            var index = element.characters.indexOf(data.data.keyword, position)

            console.log('replace while ========== :');
            console.log(index);
            console.log(item['node'].characters.indexOf(data.data.keyword, position));

            if (index > -1) {
              // 有匹配的字符

              // 在索引后插入新字符

              let insertStart = index + data.data.keyword.length + element['start']
              console.log(insertStart);

              let newCharacters = data.data.replace_word

              item['node'].insertCharacters(insertStart, newCharacters)
              // 根据索引删除旧字符
              item['node'].deleteCharacters(index + element['start'], insertStart)

              offsetEnd += data.data.replace_word.length - data.data.keyword.length

              position = index + data.data.keyword.length

            } else {
              // 没有匹配的字符
              break
            } // else

          }// while

          console.log('设置缩进、序号：');
          console.log(offsetEnd);

          // 设置缩进
          item['node'].setRangeIndentation(element['start'] + offsetStart, element['end'] + offsetEnd, element['indentation'] > 0 ? element['indentation'] - 1 : element['indentation'])
          // 设置序号
          item['node'].setRangeListOptions(element['start'] + offsetStart, element['end'] + offsetEnd, element['listOptions'])

        });// textStyle.forEach


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