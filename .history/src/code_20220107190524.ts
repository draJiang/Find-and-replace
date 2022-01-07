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
    find(msg.data)
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
          var index = item['node'].characters.indexOf(msg.data.keyword, position)
          // console.log('index:');
          // console.log(index);


          if (index > -1) {
            // 将查找的字符起始、终止位置发送给 UI
            toUIHTML.push({ 'id': item['node'].id, 'characters': item['node'].characters, 'start': index, 'end': index + msg.data.keyword.length })
            position = index + msg.data.keyword.length

          } else {
            break
          }
        }


      })
      console.log('if :toUIHTML:');
      console.log(toUIHTML);


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
function myFindTextAll(node, node_list, isLocked?,isVisible?) {

  var tagetNode

  console.log('myFindAll');
  // console.log(isLocked);

  let locked = false // 存储祖先图层的锁定状态
  let visible = true
  // console.log(node);
  // console.log(isLocked);
  // console.log(isVisible);
  console.log(node.type);
  
  if (isLocked == undefined && node.type!='PAGE') {
    // isLocked 参数为空，说明当前遍历的是祖先图层
    locked = node.locked
    visible = node.visible
    console.log('undefined::');
    console.log(node);
    console.log(isLocked);
    console.log(locked);
    
    
    
  }else{
    // isLocked 参数非空，说明当前遍历的是子孙图层
    locked = isLocked
    visible = isVisible
  }

  if (locked == undefined || visible == undefined) {
    
  }

  // 如果目标图层本身就是 TEXT 图层
  if (node.type == 'TEXT') {
    node_list.push({ 'node': node, 'locked': locked, 'visible':visible })
    return node_list
  }
  var thisChildren = node.children

  //  如果当前节点下存在子节点
  if (thisChildren == undefined) {
    // 当前节点无子节点，可能是形状图层
    return node_list
  }

  // 遍历子节点
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
      node_list.push({ 'node': thisChildren[i], 'locked': locked, 'visible': visible })
    } else {
      // 如果不是 TEXT 图层
      // 如果包含子图层
      if (thisChildren[i].children != null) {

        if (thisChildren[i].children.length > 0) {

          node_list = myFindTextAll(thisChildren[i], node_list, locked,visible)
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

// 搜索
function find(data) {
  console.log('conde.ts:find:');
  console.log(figma.currentPage);
  // 清空历史搜索数据，重新搜索
  target_Text_Node = []
  var selection = figma.currentPage.selection

  var node_list = [] // 存储目标值 —— 选中图层中，所有文本图层
  // 当前未选中图层，则在当前页面搜索
  if (selection.length == 0) {
    // node_list = figma.currentPage.findAll(n => n.type === "TEXT")

    node_list = myFindTextAll(figma.currentPage, node_list)
  } else {
    // 当前有选中图层，则在选中的图层中搜索
    // 在当前选中的图层中，搜索文本图层
    for (var i = 0; i < selection.length; i++) {
      // console.log('find:for selection');
      node_list = myFindTextAll(selection[i], node_list)

    }
  }
  // console.log('selection:');
  // console.log(selection);



  console.log('Find end:');
  console.log(node_list);

  // 在文本图层中，匹配关键字
  for (var j = 0; j < node_list.length; j++) {
    // console.log(node_list[j]['node']);

    if (node_list[j]['node']['characters'].indexOf(data.keyword) > -1) {
      // 找到关键词
      target_Text_Node.push(node_list[j])
    }
  }

}

// 替换
async function replace(data) {
  console.log('replace');
  console.log(data);

  target_Text_Node.forEach(async item => {
    // console.log('target_Text_Node.forEach:');


    console.log(item);
    
    if (item['locked'] || item['visible']==false) {
      // 如果图层或图层的祖先元素是锁定状态，则忽略
    } else {

      // 加载字体
      const fonts = item['node'].getRangeAllFontNames(0, item['node'].characters.length)
      for (const font of fonts) {
        await figma.loadFontAsync(font)
      }

      // console.log(item.characters);
      var searchRegExp = new RegExp(data.data.keyword, 'g')
      // console.log(item);
      item['node'].characters = item['node'].characters.replace(searchRegExp, data.data.replace_word)
    }


  })

  // 替换完毕，通知 UI 更新
  figma.ui.postMessage({ 'type': 'replace' })
  console.log('target_Text_Node:');
  console.log(target_Text_Node);


}

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