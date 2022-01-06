/// <reference path="../node_modules/@figma/plugin-typings/index.d.ts" />
let target_Text_Node: Array<TextNode> = [] // 存储符合搜索条件的 TEXT 图层
figma.showUI(__html__, { width: 300, height: 340 })

// console.log('hello2')
onSelectionChange()

// 绑定 Figma 图层选择变化事件
figma.on("selectionchange", () => { onSelectionChange() })

// UI 发来消息
figma.ui.onmessage = msg => {

  // UI 中点击了搜索
  if (msg.type === 'search') {

    // figma.ui.postMessage({ 'type': 'find_loading' })

    console.log('search');
    console.log(msg);

    // 执行搜索
    find_and_replace(msg.data)
    console.log('search target_Text_Node:');

    // console.log(target_Text_Node);

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
          var index = item.characters.indexOf(msg.data.keyword, position)
          // console.log('index:');
          // console.log(index);

          
          if (index > -1) {
            // 将查找的字符起始、终止位置发送给 UI
            toUIHTML.push({ 'id': item.id, 'characters': item.characters, 'start': index, 'end': index + msg.data.keyword.length })
            position = index + msg.data.keyword.length

          } else {
            break
          }
        }


      })
      // console.log('if :toUIHTML:');
      // console.log(toUIHTML);


    }

    figma.ui.postMessage({ 'type': 'find', 'target_Text_Node': toUIHTML })
    
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

      if (target_Text_Node[i].id == msg.data['item']) {
        // 找到用户点击的图层

        targetNode === target_Text_Node[i]
        // Figma 视图定位到对应图层
        figma.viewport.scrollAndZoomIntoView([target_Text_Node[i]]);
        // Figma 选中对应文本
        figma.currentPage.selectedTextRange = { 'node': target_Text_Node[i], 'start': msg.data['start'], 'end': msg.data['end'] }

        break
      }
      // console.log('------');
    }

    // console.log('targetNode:');
    // console.log(targetNode);

    // var text = figma.currentPage.findOne(n => n.id === msg.id)



  }


  if (msg.type === 'replace') {
    console.log('replace');
    console.log(msg);
    replace(msg)
    // const target_Text_Node = find_and_replace(msg.data.keyword)

  }


}

// 查找图层下的文本图层，输入 figma 图层对象，返回找到所有文本图层
function myFindTextAll(node, node_list) {

  var tagetNode

  // console.log('myFindAll');

  // 如果目标图层本身就是
  if (node.type == 'TEXT') {
    node_list.push(node)
    return node_list
  }
  var thisChildren = node.children
  //  如果当前节点下存在子节点
  // console.log(thisChildren);
  if (thisChildren == undefined) {
    // 当前节点无子节点，可能是形状图层
    return node_list
  }
  for (var i = 0; i < thisChildren.length; i++) {

    // console.log('thisChildren:')
    // console.log(thisChildren);
    if (thisChildren == undefined) {
      console.log('!!!ERRO thisChildren==undefined');

      return node_list
    }
    // 如果节点的类型为 TEXT
    if (thisChildren[i].type == 'TEXT') {

      // console.log('return thisChildren[i]:');
      // console.log(thisChildren[i]);
      node_list.push(thisChildren[i])
    } else {
      // 如果不是 TEXT 图层
      // 如果包含子图层
      if (thisChildren[i].children != null) {

        if (thisChildren[i].children.length > 0) {

          tagetNode = myFindTextAll(thisChildren[i], node_list)
        }
      }
    }




  }
  // console.log('node_list:');
  // console.log(node_list);

  return node_list
}

async function myLoadFontAsync(myFont) {
  console.log('myLoadFontAsync:');
  console.log(myFont);
  await figma.loadFontAsync(myFont)
}

function find_and_replace(data) {
  console.log('conde.ts:find_and_replace:');

  target_Text_Node = []
  var selection = figma.currentPage.selection

  var node_list = [] // 存储目标值 —— 选中图层中，所有文本图层
  // 当前未选中图层，则在当前页面搜索
  if (selection.length == 0) {
    node_list = figma.currentPage.findAll(n => n.type === "TEXT")
  } else {
    // 当前有选中图层，则在选中的图层中搜索
    // 在当前选中的图层中，搜索文本图层
    for (var i = 0; i < selection.length; i++) {
      // console.log('find_and_replace:for selection');

      // var textNode = myFindTextAll(selection[i])
      // console.log(selection[i]);
      node_list = myFindTextAll(selection[i], node_list)

    }
  }
  // console.log('selection:');
  // console.log(selection);



  console.log('Find end:');
  // console.log(node_list);

  // 获取所有文本图层的文本，批量关键字，获取符合关键字的图层列表
  // var target_Text_Node =[]
  for (var j = 0; j < node_list.length; j++) {
    if (node_list[j]['characters'].indexOf(data.keyword) > -1) {
      // 找到关键词
      target_Text_Node.push(node_list[j])
    }
  }

  // figma.loadFontAsync(target_Text_Node[0].fontName)

  // console.log('target_Text_Node:');
  // console.log(target_Text_Node);

}

async function replace(data) {
  console.log('replace');
  console.log(data);

  // var target_Text_Node = []
  // 将符合条件的图层中的指定文本替换成目标值
  // var myfont = target_Text_Node[0].fontName

  // await myLoadFontAsync(myfont)
  // await figma.loadFontAsync(myfont)

  target_Text_Node.forEach(async item => {
    // console.log('target_Text_Node.forEach:');

    const fonts = item.getRangeAllFontNames(0, item.characters.length)
    for (const font of fonts) {
      await figma.loadFontAsync(font)
    }

    // console.log(item.characters);
    var searchRegExp = new RegExp(data.data.keyword, 'g')
    // console.log(item);
    item.characters = item.characters.replace(searchRegExp, data.data.replace_word)

  })


  figma.ui.postMessage({ 'type': 'replace' })
  console.log('target_Text_Node:');
  console.log(target_Text_Node);


}

function onSelectionChange() {

  var selection = figma.currentPage.selection
  // 当前未选中图层，则在当前页面搜索
  if (selection.length == 0) {
    figma.ui.postMessage({ 'type': 'onSelectionChange', 'selectionPage': true })
  } else {
    figma.ui.postMessage({ 'type': 'onSelectionChange', 'selectionPage': false })
  }
}