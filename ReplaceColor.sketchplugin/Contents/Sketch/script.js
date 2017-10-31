var onRun = function(context) {
  var selection = context.selection,
    doc = context.document,
    infoText = "Enter 2 #hex: match color and replace color",
    defaultValues = "#F02424,#F8E71C",
    userInput = doc.askForUserInput_initialValue(infoText, defaultValues)

  if(userInput == nil) return
  
  var colorArray = userInput.split(","),
    matchColor = colorArray[0]
    replaceColor = colorArray[1]

  // convert replace color
  replaceColor = MSImmutableColor.colorWithSVGString(replaceColor).newMutableCounterpart()

  // select all layers if there is no selection
  if (selection.count() == 0) {
    selection = doc.currentPage().children()
  }

  // log("DEBUG: Selected layertypes: " + selection.count())

  // loop through selected layers
  for (var i = 0; i < selection.count(); i++) {
    var layerType = selection[i]
    var hasColor = false

    log("DEBUG: Found layertype " + layerType)
    if (typeof layerType.style == "function") {
      replaceFillColor(layerType, matchColor, replaceColor) 
      replaceBorderColor(layerType, matchColor, replaceColor)
    }

    if (typeof layerType.textColor == "function") {
      replaceFontColor(layerType, matchColor, replaceColor)
    }
  }   
}

var replaceFillColor = function(layer, matchColor, replaceColor) {  
  var fills = layer.style().fills()
  var fillsLoop = fills.objectEnumerator();

  // loop through fills
  while(nextFill = fillsLoop.nextObject()) {
    
    if (nextFill.isEnabled() == false) { continue }

    var fillColor = "#" + nextFill.color().immutableModelObject().hexValue().toString()
    
    if (fillColor != matchColor) { continue }

    log("DEBUG: Found layer with matching color:" + fillColor + " enabled:" + nextFill.isEnabled())

    nextFill.setColor(replaceColor)
  }
}

var replaceBorderColor = function(layer, matchColor, replaceColor) {

  var borders = layer.style().borders()
  var bordersLoop = borders.objectEnumerator();
  var matchingBorders = []

  // loop through borders
  while(nextBorder = bordersLoop.nextObject()) {

    if (nextBorder.isEnabled() == false) { continue }

    var borderColor = "#" + nextBorder.color().immutableModelObject().hexValue().toString()
    
    if (borderColor != matchColor) { continue }

    log("DEBUG: Found border with matching color:" + borderColor + " enabled:" + nextBorder.isEnabled())

    nextBorder.setColor(replaceColor)
  }
}

var replaceFontColor = function(layer, matchColor, replaceColor) {

  var textColor = "#" + layer.textColor().immutableModelObject().hexValue().toString()

  if (textColor == matchColor) { 
    log("DEBUG: Found text with matching color:" + textColor)

    layer.setTextColor(replaceColor)
  }
}