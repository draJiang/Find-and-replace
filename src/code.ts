/// <reference path="../node_modules/@figma/plugin-typings/index.d.ts" />
var target_Text_Node: Array<TextNode> = []
figma.showUI(__html__, { width: 300, height: 340 })

// console.log('hello2')
onSelectionChange()
figma.on("selectionchange", () => { onSelectionChange() })


figma.ui.onmessage = msg => {

  if (msg.type === 'search') {
    console.log('search');
    console.log(msg);

    var toUIHTML = find_and_replace(msg.data)
    console.log('search target_Text_Node:');
    console.log(toUIHTML);
    figma.ui.postMessage({ 'type': 'find', 'target_Text_Node': toUIHTML })
    // figma.closePlugin()
  }

  if (msg.type === 'listOnClik') {
    console.log('code js:listOnClik:');

    console.log(msg);
    console.log(target_Text_Node);
    console.log(target_Text_Node[0]);
    var targetNode
    console.log('forEach:');

    for (var i = 0; i < target_Text_Node.length; i++) {
      console.log(target_Text_Node[i].id);
      // console.log(msg.data.item);
      console.log(msg.data['item']);

      if (target_Text_Node[i].id == msg.data['item']) {
        console.log('bingo');
        console.log(target_Text_Node[i]);

        targetNode === target_Text_Node[i]
        figma.viewport.scrollAndZoomIntoView([target_Text_Node[i]]);
        figma.currentPage.selectedTextRange = { 'node': target_Text_Node[i], 'start': msg.data['start'], 'end': msg.data['end'] }

        break
      }
      console.log('------');
    }

    console.log('targetNode:');
    console.log(targetNode);

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

  console.log('myFindAll');

  // 如果目标图层本身就是
  if (node.type == 'TEXT') {
    node_list.push(node)
    return node_list
  }
  var thisChildren = node.children
  //  如果当前节点下存在子节点
  console.log(thisChildren);
  if (thisChildren == undefined) {
    // 当前节点无子节点，可能是形状图层
    return node_list
  }
  for (var i = 0; i < thisChildren.length; i++) {

    console.log('thisChildren:')
    console.log(thisChildren);
    if (thisChildren == undefined) {
      console.log('!!!ERRO thisChildren==undefined');

      return node_list
    }
    // 如果节点的类型为 TEXT
    if (thisChildren[i].type == 'TEXT') {

      console.log('return thisChildren[i]:');
      console.log(thisChildren[i]);
      node_list.push(thisChildren[i])
    } else {
      // 如果不是 TEXT 图层
      // 如果包含子图层
      if (thisChildren[i].children != null) {

        if (thisChildren[i].children.length > 0) {

          console.log('递归');

          tagetNode = myFindTextAll(thisChildren[i], node_list)
        }
      }
    }




  }
  console.log('node_list:');
  console.log(node_list);

  return node_list
}

async function myLoadFontAsync(myFont) {
  console.log('myLoadFontAsync:');
  console.log(myFont);
  await figma.loadFontAsync(myFont)
}

async function find_and_replace(data) {
  console.log('conde.ts:find_and_replace:');
  figma.ui.postMessage({ 'type': 'find_loading'})
  target_Text_Node = []
  var selection = figma.currentPage.selection

  var node_list = [] // 存储目标值 —— 选中图层中，所有文本图层
  // 当前未选中图层，则在当前页面搜索
  if (selection.length == 0) {
    selection = figma.currentPage.children
  } else {
    // 当前有选中图层，则在选中的图层中搜索
  }
  console.log('selection:');
  console.log(selection);

  // 在当前选中的图层中，搜索文本图层
  for (var i = 0; i < selection.length; i++) {
    console.log('find_and_replace:for selection');

    // var textNode = myFindTextAll(selection[i])
    console.log(selection[i]);
    node_list = await myFindTextAll(selection[i], node_list)

  }

  console.log('Find end:');
  console.log(node_list);

  // 获取所有文本图层的文本，批量关键字，获取符合关键字的图层列表
  // var target_Text_Node =[]
  for (var j = 0; j < node_list.length; j++) {
    if (node_list[j]['characters'].indexOf(data.keyword) > -1) {
      // 找到关键词
      target_Text_Node.push(node_list[j])
    }
  }

  // figma.loadFontAsync(target_Text_Node[0].fontName)
  console.log('target_Text_Node:');
  console.log(target_Text_Node);

  if (target_Text_Node.length > 0) {
    var toUIHTML = []
    target_Text_Node.forEach(item => {
      console.log('target_Text_Node.forEach:');

      var position = 0
      while (true) {
        var index = item.characters.indexOf(data.keyword, position)
        console.log('index:');
        console.log(index);

        if (index > -1) {
          toUIHTML.push({ 'id': item.id, 'characters': item.characters, 'start': index, 'end': index + data.keyword.length })
          position = index + data.keyword.length
          console.log(toUIHTML);
          console.log(position);

        } else {
          break
        }
      }


    })
    console.log('toUIHTML:');
    console.log(toUIHTML);


  }
  return toUIHTML

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
    console.log('target_Text_Node.forEach:');

    const fonts = item.getRangeAllFontNames(0, item.characters.length)
    for (const font of fonts) {
      await figma.loadFontAsync(font)
    }

    console.log(item.characters);
    var searchRegExp = new RegExp(data.data.keyword, 'g')
    console.log(item);
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