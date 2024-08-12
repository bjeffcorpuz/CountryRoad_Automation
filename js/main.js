const btnSlide = $("#slidingDiv");
const divSelection = $("#contentSelection");
let isVisible = false; //state of div data
let isVisibleContent = false; //state of div selection
let globalHtml = {} //for live text and custom code
let globalBlock = [] //for blocks
let linksChecker = []
let tierLinks = {};
let auLinks = "";
let nzLinks = "";
let outsideLinks = "";
let checkLinks = [];
let errorMessages = [];

function generateCode() {
    // Generate a random 5-digits code
    const fiveDigitCode = Math.floor(100000 + Math.random() * 9000);
  
    // Generate 4 random letters
    const randomLetters = Array.from({ length: 4 }, () =>
      String.fromCharCode(65 + Math.floor(Math.random() * 26))
    ).join('');
  
    // Combine the code and letters
    const generatedCode = `${fiveDigitCode}-${randomLetters}`;
  
    return generatedCode;
}
  


// $(".contentBuilder").sortable({
//     revert: true
//   });


// Adding Block
$(document).on('click','#addBlock',function(){
    //$(".toggle-button").click()
    //adding block
    const blockHtml = `<div dataid="${generateCode()}" class="block"><div class="controls"><i class="fa-solid fa-globe buildIcon linkOnly" title="Link Only"></i><i class="fa-solid fa-code buildIcon addCustom" title="Custom Code"></i><i class="fa-solid fa-table buildIcon addTable" title="Add Table"></i><i class="fa-solid fa-rectangle-xmark buildIcon redIcon removeParent" title="Remove Block"></i></div></div>`;

    //appending it to .contentBuilder
    $(".contentBuilder").append(blockHtml);
});

//adding table
$(document).on('click','.addTable',function(){
    const tableHtml = `<div class="table"><div class="controls"><i class="fa-regular fa-square buildIcon addColumn" title="One Column Row" data-column="1"></i><i class="fa-solid fa-table-columns buildIcon addColumn" title="Two Columns Row" data-column="2"></i><i class="fa-solid fa-rectangle-xmark buildIcon redIcon removeParent" title="Remove Table"></i></div></div>`;

    //appending the controls
    $(this).parent().parent().append(tableHtml);
});

//adding Outer Custom
$(document).on('click','.addCustom',function(){

    //adding block
    let code = generateCode();
    const customHtml = `<div class="customBlock" data-id="${code}" data-status="inactive"><i class="fa-solid fa-code addData" data-status="inactive"></i>[${code}]</div>`;

    //appending the custom block
    $(this).parent().parent().append(customHtml);
});

//adding Outer Custom
$(document).on('click','.linkOnly',function(){

    //adding block
    let code = generateCode();
    const customHtml = `<div class="linkOnlyContainer" data-id="${code}" data-status="inactive"><i class="fa-solid fa-globe addData" data-status="inactive"></i>[${code}]</div>`;

    //appending the custom block
    $(this).parent().parent().append(customHtml);
});

//removing parent
$(document).on('click','.removeParent',function(){
    $(this).parent().parent().remove();

    //removing each child that is active on the selectiond div
    $(this).parent().parent().find(".openSelection").each(function(){
        let getId = $(this).attr("data-id");
        //removing any active content on the content selection
        $('#contentSelection[data-clone="' + getId + '"').remove();

    });
});

//adding Column into table
$(document).on('click',".addColumn",function(){
    let column = $(this).attr("data-column");
    let columnHtml = '';

    if(column == 2){
        let td1 = generateCode();
        let td2 = generateCode()
        columnHtml = `<div class="twocolumn grid gap-2"><div class="halfcolumn openSelection" data-id="${td1}" data-sibling="${td2}" data-status="inactive"></div><div data-status="inactive" class="halfcolumn openSelection" data-id="${td2}" data-sibling="${td1}"></div></div>`;
    }else{
        columnHtml = `<div class="fullcolumn openSelection" data-id="${generateCode()}" data-status="inactive"></div>`;
    }

    //appending to the closest table
    $(this).parent().parent().append(columnHtml)

});

//Adding content for .openSelection
$(document).on('dblclick','.openSelection',function(){
    let id = $(this).attr("data-id");
    let isContent = $(this).find(".addData");

    //check if user already selected a content, add text depend on content
    if($(this).children().length == 0){
        $(this).text(`[${id}]`);
    }

    
    //make sure that its status is inactive to append
    if($(this).attr("data-status") == "inactive"){
        //editing the header before appending
        let content = $("#contentSelection").clone();
        content.attr("data-clone",id);
        content.find("#changeHeader").text(`Select Content For: ${id}`);

        //add .selected if theres already a data
        if(content){
            //check which one is selected
            if(isContent.hasClass("fa-image")){
                content.find(".fa-image").parent().addClass("selected");
            }

            if(isContent.hasClass("fa-link")){
                content.find(".fa-link").parent().addClass("selected");
            }

            if(isContent.hasClass("fa-font")){
                content.find(".fa-font").parent().addClass("selected");
            }
        }

        $("#contentContainer").append(content)
        $(this).attr("data-status","active");
    }
});

//closing open selection .closeSelection
$(document).on('click','.closeSelection',function(){
    let parentId = $(this).closest("#contentSelection");
    //removing itself from the container
    parentId.remove();
    //changing status 
    $('.openSelection[data-id="' + parentId.attr("data-clone") + '"').attr("data-status","inactive");
});


//selecting content
$(document).on('click','.selectContent', function(){

    let content = '';
    let parentId =  $(this).closest("#contentSelection");
    let checkCurrent =  $('.openSelection[data-id="' + parentId.attr("data-clone") + '"').find("i.addData");
    let selected = '';

    if($(this).hasClass("fa-image")){
        selected = "fa-image";
        content = `<i class="fa-solid fa-image addData" title="Click to add data" data-status="inactive"></i>${parentId.attr("data-clone")}`
    }

    if($(this).hasClass("fa-link")){
        selected = "fa-link";
        content = `<i class="fa-solid fa-link addData"  title="Click to add data" data-status="inactive"></i>${parentId.attr("data-clone")}`
    }

    if($(this).hasClass("fa-font")){
        selected = "fa-font";
        content = `<i class="fa-solid fa-font addData" title="Click to add data" data-status="inactive"></i>${parentId.attr("data-clone")}`
    }    

    //check if current already have data

    let getData = (checkCurrent.attr("data")) ? JSON.parse(checkCurrent.attr("data")).contentType : checkCurrent.attr("data");

    if(getData == selected){
        $('.openSelection[data-id="' + parentId.attr("data-clone") + '"').attr("data-status","inactive");
    }else{
        //if current and present are not selected, chage status and append selected content
        $('.openSelection[data-id="' + parentId.attr("data-clone") + '"').attr("data-status","inactive").empty().append(content);
        //also delete the data form if open
        $('.fForm[data-for="' + parentId.attr("data-clone") + '"').remove();
    }


    //removing itself from the container
    parentId.remove();

});

//removing element .removeElement
$(document).on('click','.removeElement',function(){
    let parentId = $(this).closest("#contentSelection");
    let origElement = $('.openSelection[data-id="' + parentId.attr("data-clone") + '"');

    //check if its one column or two columnt
    if(origElement.hasClass("fullcolumn")){
        //removing the actual element
        origElement.remove();
        //removing any forms active in Data Forms
        $('.fForm[data-for="' + parentId.attr("data-clone") + '"').remove();
    }

    if(origElement.hasClass("halfcolumn")){
        //removing the parent element
        origElement.parent().remove();
        
        let sibling = origElement.attr("data-sibling");
        //removing the selection div of the sibling
        $('#contentSelection[data-clone="' + sibling + '"').remove();

        //removing any forms active in Data Forms
        $('.fForm[data-for="' + parentId.attr("data-clone") + '"').remove(); //orginal
        $('.fForm[data-for="' + sibling + '"').remove(); //siblings
    }

    //removing itself from the container
    parentId.remove();

});

//adding data .addData
$(document).on('click','.addData',function(){
    let dataId = $(this).parent().attr("data-id");
    let dataStatus = $(this).attr("data-status");
    let data = ($(this).attr("data")) ? JSON.parse($(this).attr("data")) : "";
    let formHTML = '';
    //check what content it is
    if($(this).hasClass("fa-image")){
        formHTML =`
        <div class="col-6 nopad fForm" data-for="${dataId}" data-content="fa-image">
            <div class="form">
                <div class="row">
                    <div class="col-6 text-start mb-2">
                        <span class="nameSlice">[${dataId}]</span>
                    </div>
                    <div class="col-6 text-end mb-2">
                        <i style="font-size:24px" class="fa btnClose"></i>
                    </div>
                </div>
                <div class="row">
                    <div class="input-group mb-2">
                        <span class="input-group-text">Img Src*</span>
                        <input type="text" class="form-control imgSrc" placeholder="Image Source" value="${(data) ?  data.imgSrc : ''}">
        
                    </div>
                    <div class="input-group mb-2">
                        <span class="input-group-text">Img Alt</span>
                        <input type="text" class="form-control imgAlt" placeholder="Image Alt" value="${(data) ? data.imgAlt : ''}">
        
                    </div>
                    <div class="text-end">
                        <button type="button" class="btn btn-primary save">Save</button>
                    </div>
                </div>
            </div>
        </div>    
            `
    }

    if($(this).hasClass("fa-link") || $(this).hasClass("fa-globe")){
        //check if deeplinks inputs need disabling
        let disable = '';
        if(data.actualLink || data.noDl){
            disable = ' disabled'
        }

        let imgForm = ''
        let dataContent = '';
        let removeBtn = ''

        if($(this).hasClass("fa-link")){
            imgForm = `
                    <div class="input-group mb-2">
                        <span class="input-group-text">Img Src*</span>
                        <input type="text" class="form-control imgSrc" placeholder="Image Source" value="${(data) ?  data.imgSrc : ''}">
        
                    </div>
                    <div class="input-group mb-2">
                        <span class="input-group-text">Img Alt</span>
                        <input type="text" class="form-control imgAlt" placeholder="Image Alt" value="${(data) ? data.imgAlt : ''}">
        
                    </div>`
            dataContent = "fa-link"        
        }else{
            dataContent = "fa-globe"
            removeBtn = `<button type="button" class="btn btn-danger removeCode">Remove</button>`
        }

        formHTML =`
        <div class="col-6 nopad fForm" data-for="${dataId}" data-content="${dataContent}">
            <div class="form">
                <div class="row">
                    <div class="col-6 text-start mb-2">
                        <span class="nameSlice">[${dataId}]</span>
                    </div>
                    <div class="col-6 text-end mb-2">
                        <i style="font-size:24px" class="fa btnClose"></i>
                    </div>
                </div>
                <div class="row">
                    <div class="input-group mb-2">
                        <span class="input-group-text">Slice*</span>
                        <input type="text" class="form-control slice" placeholder="Slice Number" value="${(data) ? data.slice : ''}">
        
                    </div>
                    <div class="input-group mb-2">
                        <span class="input-group-text">Link*</span>
                        <input type="text" class="form-control link" placeholder="{{Base URL}} + Link, type '{{BaseURL}}' if only BaseURL" value="${(data) ? data.link : ''}">
        
                    </div>
                    ${imgForm}
                    <div class="input-group mb-2">
                        <span class="input-group-text gold">Deeplink</span>
                        <input type="text" class="form-control goldDl" placeholder="Gold Deeplink" value="${(data) ? data.goldTier : ''}"${disable}>
                    </div>
                    <div class="input-group mb-2">
                        <span class="input-group-text silver">Deeplink</span>
                        <input type="text" class="form-control silverDl" placeholder="Silver Deeplink" value="${(data) ? data.silverTier : ''}"${disable}>
                    </div>
                    <div class="input-group mb-2">
                        <span class="input-group-text bronze">Deeplink</span>
                        <input type="text" class="form-control bronzeDl" placeholder="Bronze Deeplink" value="${(data) ? data.bronzeTier : ''}"${disable}>
                    </div>
                    <div class="input-group mb-2">
                        <span class="input-group-text member">Deeplink</span>
                        <input type="text" class="form-control memberDl" placeholder="Member Deeplink" value="${(data) ? data.memberTier : ''}"${disable}>
                    </div>
                    <div class="text-start mb-2">
                        <input class="form-check-input actualLink" type="checkbox" value="" id="${dataId}" ${((data) ? (data.actualLink === true ? "checked" : "") : '')}>
        
                        <label class="form-check-label" for="${dataId}">
                            Use actual <strong>Link</strong>
                        </label>
                    </div>
                    <div class="text-start mb-2">
                        <input class="form-check-input noDl" type="checkbox" value="" id="${dataId}2" ${(data) ? (data.noDl === true ? "checked" : "") : ''}>
                        <label class="form-check-label" for="${dataId}2">
                            No Deep Links
                        </label>
                    </div>
                    <div class="text-end">
                        ${removeBtn}
                        <button type="button" class="btn btn-primary save">Save</button>
                    </div>
                </div>
            </div>
        </div>    
            `        
    }

    if($(this).hasClass("fa-font")){
        let templateTrTd = `
    <tr>
        <td style="font-size: 16px; font-family:'Roboto',Arial, sans-serif; letter-spacing:0px; text-align:left;  line-height: 28px; color: #54555c; display:block; font-weight:400; margin:0 auto; padding: 0px 50px" valign="top" align="left" class="left-copy-pad-8 body-copy">

            Only edit the content and necessary attribute in td    

        </td>
    </tr>        
        `

        formHTML =`
        <div class="col-6 nopad fForm" data-for="${dataId}" data-content="fa-font">
            <div class="form">
                <div class="row">
                    <div class="col-6 text-start mb-2">
                        <span class="nameSlice">[${dataId}]</span>
                    </div>
                    <div class="col-6 text-end mb-2">
                        <i style="font-size:24px" class="fa btnClose"></i>
                    </div>
                </div>
                <div class="row">
                    <div class="input-group">
                        <div class="alert alert-dark" role="alert" style="width: 100%">
                            Edit the attributes on &lt;td&gt; accordingly
                        </div>
                    </div>
                    <div class="input-group mb-2">
                        <div class="form-floating">
                            <textarea class="form-control liveText" placeholder="Leave a comment here" style="height: 323px">${(data) ? data.html : templateTrTd}</textarea>
                            <label for="floatingTextarea2">Edit on your editor first</label>
                        </div>
                    </div>
                    <div class="input-group">
                        <div class="alert alert-danger" role="alert" style="width: 100%">
                            Do not remove the outer &lt;tr&gt; and &lt;td&gt;
                        </div>
                    </div>
                    <div class="text-end">
                        <button type="button" class="btn btn-primary save">Save</button>
                    </div>
                </div>
            </div>
        </div>    
            `   
    }    

    if($(this).hasClass("fa-code")){

        formHTML =`
        <div class="col-6 nopad fForm" data-for="${dataId}" data-content="fa-code">
            <div class="form codeC">
                <div class="row">
                    <div class="col-6 text-start mb-2">
                        <span class="nameSlice">[${dataId}]</span>
                    </div>
                    <div class="col-6 text-end mb-2">
                        <i style="font-size:24px" class="fa btnClose"></i>
                    </div>
                </div>
                <div class="row">
                    <div class="input-group">
                        <div class="alert alert-primary" role="alert" style="width: 100%">
                            Put the whole HTML table code here
                        </div>
                    </div>
                    <div class="input-group mb-2">
                        <div class="form-floating">
                            <textarea class="form-control liveText" placeholder="Leave a comment here" style="height: 323px">${(data) ? globalHtml[dataId] : ''}</textarea>
                            <label for="floatingTextarea2">Edit on your editor first</label>
                        </div>
                    </div>
                    <div class="input-group">
                        <div class="alert alert-danger" role="alert" style="width: 100%">
                            Make sure there's no open tag on the code
                        </div>
                    </div>
                    <div class="text-end">
                        <button type="button" class="btn btn-danger removeCode">Remove</button>
                        <button type="button" class="btn btn-primary save">Save</button>
                    </div>
                </div>
            </div>
        </div>    
            `   

        
    }     



    
    //if inactive, add data form
    if(dataStatus == "inactive"){
        $("#formContainer").append(formHTML);
        //changing the status
        $(this).attr("data-status","active")
    }
});


//simple closing .btnClose
$(document).on("click",".btnClose",function(){
    let origElement = $(this).closest(".fForm");
    let content = origElement.attr("data-content");

    //removing self to the continer
    origElement.remove();

    //changing status to inactive

    let originalContent = ''
    if(content == "fa-code"){
        originalContent = $('.customBlock[data-id="' + origElement.attr("data-for") + '"').find(".addData");
    }else if(content == "fa-globe"){
        originalContent = $('.linkOnlyContainer[data-id="' + origElement.attr("data-for") + '"').find(".addData");
    }else{
        originalContent = $('.openSelection[data-id="' + origElement.attr("data-for") + '"').find(".addData");
    }

    originalContent.attr("data-status","inactive");
});

//removing custom code
$(document).on("click",".removeCode",function(){
    let origElement = $(this).closest(".fForm");

    //check if its fa-globe or fa-code
    if(origElement.attr("data-content") == "fa-code"){

        //removing the actual block
        $('.customBlock[data-id="' + origElement.attr("data-for") + '"').remove();

        //removing to global variable
        delete globalHtml[origElement.attr("data-for")];

    }else{
        $('.linkOnlyContainer[data-id="' + origElement.attr("data-for") + '"').remove();
    }

    //removing self in the container
    origElement.remove();
});


//saving data on content
$(document).on("click",'.save',function(){
    let data = {};
    let formParent = $(this).closest(".fForm");
    let contentType = formParent.attr("data-content")
    let parentID = formParent.attr("data-for");
    let save = 0;
    
    //saving data into obj, also based on what type
    if(contentType == "fa-link"){
        //check if any of slice,link,src or (GD or SD or BD or MD) have data
        if($.trim(formParent.find(".slice").val()) || $.trim(formParent.find(".link").val()) || $.trim(formParent.find(".imgSrc").val()) || $.trim(formParent.find(".goldDl").val()) ||  $.trim(formParent.find(".silverDl").val()) || $.trim(formParent.find(".bronzeDl").val()) || $.trim(formParent.find(".memberDl").val())){
            data.slice = $.trim(formParent.find(".slice").val());
            data.link = $.trim(formParent.find(".link").val());
            data.imgSrc = $.trim(formParent.find(".imgSrc").val());
            data.imgAlt = $.trim(formParent.find(".imgAlt").val());
            data.goldTier = $.trim(formParent.find(".goldDl").val());
            data.silverTier = $.trim(formParent.find(".silverDl").val());
            data.bronzeTier = $.trim(formParent.find(".bronzeDl").val());
            data.memberTier = $.trim(formParent.find(".memberDl").val());
            data.actualLink = formParent.find(".actualLink").is(':checked');
            data.noDl = formParent.find(".noDl").is(':checked');
            data.contentType = contentType;
            data.id = parentID;
            save = 1;
        }
    }

    if(contentType == "fa-globe"){
        //check if any of slice,link,src or (GD or SD or BD or MD) have data
        if($.trim(formParent.find(".slice").val()) || $.trim(formParent.find(".link").val()) || $.trim(formParent.find(".goldDl").val()) ||  $.trim(formParent.find(".silverDl").val()) || $.trim(formParent.find(".bronzeDl").val()) || $.trim(formParent.find(".memberDl").val())){
            data.slice = $.trim(formParent.find(".slice").val());
            data.link = $.trim(formParent.find(".link").val());
            data.goldTier = $.trim(formParent.find(".goldDl").val());
            data.silverTier = $.trim(formParent.find(".silverDl").val());
            data.bronzeTier = $.trim(formParent.find(".bronzeDl").val());
            data.memberTier = $.trim(formParent.find(".memberDl").val());
            data.actualLink = formParent.find(".actualLink").is(':checked');
            data.noDl = formParent.find(".noDl").is(':checked');
            data.contentType = contentType;
            data.id = parentID;
            save = 1;
        }
    }    

    if(contentType == "fa-image"){
        //if img src is not empty, then save
        if($.trim(formParent.find(".imgSrc").val())){
            data.imgSrc = $.trim(formParent.find(".imgSrc").val());
            data.imgAlt = $.trim(formParent.find(".imgAlt").val());
            data.contentType = contentType;
            data.id = parentID;
            save = 1;
        }
    }  
    
    if(contentType == "fa-font"){
        //if the textarea is not empty save
        if($.trim(formParent.find(".liveText").val())){
            data.html = $.trim(formParent.find(".liveText").val());
            data.contentType = contentType;
            data.id = parentID;
            save = 1;
        }
    }  

    if(contentType == "fa-code"){
        //saving to global variable
        if($.trim(formParent.find(".liveText").val())){
            globalHtml[parentID] = $.trim(formParent.find(".liveText").val());
            data.contentType = contentType;
            data.id = parentID;
            save = 1;
        }
        

    }     


    //changing status to inactive and adding the data
    let originalContent = ''
    if(contentType == "fa-code"){
        originalContent = $('.customBlock[data-id="' + parentID + '"');
    }else if(contentType == "fa-globe"){
        originalContent = $('.linkOnlyContainer[data-id="' + parentID + '"');
    
    }else{
        originalContent = $('.openSelection[data-id="' + parentID + '"');
    }

    if(save == 1){
        originalContent.find(".addData").attr("data-status","inactive").attr("data",JSON.stringify(data));
    }else{
        originalContent.find(".addData").attr("data-status","inactive");
    }
    
    

    //removing self to the continer
    formParent.remove()
});

//preview
$(document).on("click","#previewBuild",function(){
    //removing message alerts
    $("#errorPrep .alert").remove();

    buildBlocks();
    emailTemplate();
    printDataString();
    setLiquid();
    missingData();
    printLiquidscript();
});


function buildBlocks(){
    globalBlock = []; //resetting;
    let block = $(".contentBuilder > .block");
    let count = 0;
    
  
    
    block.each(function(){
        let perBlock = {};
        count++;
        let dataId = $(this).attr("dataid");
        let currentElement = $(this).find("> div");
        let innerBlock = [];
        
        // looping the child of .block
        currentElement.each(function(){
            let perTable = {};
            let column = 1;
            let perRow = [];
            let childTable = $(this).find("> div");         

            //check if its only .table or .customBlock
            if($(this).hasClass("table")){

                //check for .fullcolumn and .twocolumn
                childTable.each(function(){

                    let content = {};
                    //check if .fullcolumn
                    if($(this).hasClass("fullcolumn")){

                        if($(this).find("i.addData").length > 0 && $(this).find("i.addData").attr("data")){

                            let getData = $(this).find("i.addData").attr("data");
                            content.columnType = "fullcolumn";
                            content.data = getData;
                            perRow.push(content);
                            
                        }
                    }
                    //check if .twocolumn
                    if($(this).hasClass("twocolumn")){
                        let leftData = $(this).find(".halfcolumn").eq(0).find("i.addData").attr("data");
                        let rightData = $(this).find(".halfcolumn").eq(1).find("i.addData").attr("data");

                        //check if it needed saving
                        if(leftData && rightData){
                            content.columnType = "twocolumn";
                            content.data = [leftData,rightData];
                            column = 2;
                            perRow.push(content);
                        }

                    }
                });

                //check if needs to save
                if(perRow.length > 0){
                    perTable.tableType = "table";
                    perTable.column = column;
                    perTable.data = perRow;
                    innerBlock.push(perTable)
                }
                

            }

            if($(this).hasClass("customBlock")){
                let content = {};
                let dataId = $(this).attr("data-id");
                let data = $(this).find("i.addData").attr("data");
                //if theres data, save
                if(data){
                    content.columnType = "codeBlock";
                    content.data = globalHtml[dataId];
                    content.id = dataId;
                    perRow.push(content);
                }

                //check if needs to save
                if(perRow.length > 0){
                    perTable.tableType = "customTable";
                    perTable.column = column;
                    perTable.data = perRow;
                    innerBlock.push(perTable)
                }

            }

            if($(this).hasClass("linkOnlyContainer")){
                let content = {};
                let dataId = $(this).attr("data-id");
                let data = $(this).find("i.addData").attr("data");
                //if theres data, save
                if(data){
                    content.columnType = "linkOnly";
                    content.data = data;
                    content.id = dataId;
                    perRow.push(content);
                }

                //check if needs to save
                if(perRow.length > 0){
                    perTable.tableType = "linkOnly";
                    perTable.column = column;
                    perTable.data = perRow;
                    innerBlock.push(perTable)
                }

            }

        });

        //check if needed savings in the globalblock
        if(innerBlock.length > 0){
            perBlock.type = "block";
            perBlock.data = innerBlock;
            globalBlock.push(perBlock);
        }
        
        
    });

    //console.log(JSON.stringify(globalBlock));
}

function emailTemplate(){
    
    let block = '';
    
    for (let index = 0; index < globalBlock.length; index++) {

        let content = '';

        //block level
        for (let tblIndex = 0; tblIndex < globalBlock[index].data.length; tblIndex++) {
            const element = globalBlock[index].data[tblIndex];

            content += generateTable(element);

        }


        if($.trim(content)){

        block += `
<!-- Block ${index + 1} -->
${content}
<!-- end of Block ${index + 1} -->        
        `
        }

    }

    //adding spinner tp the preview content
    let spinnerHtml = `<div class="spinner-border text-dark" role="status"><span class="visually-hidden">Loading...</span></div>`
    $("#previewContainer").empty().append(spinnerHtml);
    $("#btnContainer").css("display","block");

    //appending to the div after 5 secs
    $("#previewContainer").empty().append(block);
    
}

function generateTable(data){
    let tableType = data.tableType;
    let column = data.column;
    let dataTr = data.data;
    let contentHtml = '';
    let htmlTable = '';


    for (let index = 0; index < dataTr.length; index++) {
        if(tableType != "linkOnly"){
            contentHtml += generateRows(dataTr[index], column);
        }
    }


    if (tableType != "customTable" && tableType != "linkOnly"){
        htmlTable = 
`<table align="center" border="0" cellpadding="0" cellspacing="0" class="full-width" width="600">
\t<tbody>${contentHtml}\t</tbody>
</table>`
    }else{
        if(tableType == "customTable"){
            htmlTable = `${contentHtml}\n`
        }else{
            htmlTable = ""
        }
    }
    
    return htmlTable;


}

function generateRows(trDatas, column){
    let columnType = trDatas.columnType;
    let trColspan = (column == 2) ? ' colspan="2" ' : '';
    let trData = trDatas.data;
    let html = '';

    //templating
    //check if fullcolumn, twocolumn or codeBlock
    if (columnType == "fullcolumn"){
        trData = JSON.parse(trData);
        //check if live font
        if(trData.contentType == "fa-font"){
            html = `\t${trData.html}\n`;
        }else{


        let linkStart = (trData.contentType == "fa-link") ? `<a href="{{ Link${trData.slice} }}?" {{clicktracking}}style="text-decoration: none;" target="_blank">` : '';
        let linkEnd = (trData.contentType == "fa-link") ?  '</a>' : '';
        
        
html = `
    <tr>
        <td align="center" valign="top" background="${trData.imgSrc}" style="background: url('${trData.imgSrc}') top left / cover no-repeat; background-size: cover; height: inherit; width: 600px;"${trColspan}>
            ${linkStart}
                <!--[if !mso 9]><!-->
                <div class="mobile-show" width="100%" style="mso-hide: all; display:none; overflow: hidden; max-height: 0px; line-height:0;">
                <img width="100%" src="${trData.imgSrc}" style="mso-hide:all;" alt="${trData.imgAlt}" border="0">
                </div>
                <!--<![endif]-->
                <img class="mobile-hide" width="600" height="auto" src="${trData.imgSrc}" style="display:block; max-width: 600px; width:100%;" alt="${trData.imgAlt}" border="0">
            ${linkEnd}
        </td>
    </tr>
`
}
    }

    if (columnType == "twocolumn"){
        //converting array(string) to obj
        trData = [JSON.parse(trData[0]),JSON.parse(trData[1])];

        let linkStartL = (trData[0].contentType == "fa-link") ? `<a href="{{ Link${trData[0].slice} }}?" {{clicktracking}}style="text-decoration: none;" target="_blank">` : '';
        let linkEndL = (trData[0].contentType == "fa-link") ?  '</a>' : '';

        let linkStartR = (trData[1].contentType == "fa-link") ? `<a href="{{ Link${trData[1].slice} }}?" {{clicktracking}}style="text-decoration: none;" target="_blank">` : '';
        let linkEndR = (trData[1].contentType == "fa-link") ?  '</a>' : '';

        let leftContent = '';
        let rightContent = '';

        if(trData[0].contentType != 'fa-font'){
            leftContent = `
                    <tr>
                    <td align="center" style="padding: 0px 0px 0px 0px">
                        ${linkStartL}
                            <!--[if !mso 9]><!-->
                            <div class="mobile-show" width="100%" style="mso-hide: all; display:none; overflow: hidden; max-height: 0px; line-height:0;">
                            <img width="100%" src="${trData[0].imgSrc}" style="mso-hide:all;" alt="${trData[0].imgAlt}" border="0">
                            </div>
                            <!--<![endif]--> 
                            <img class="mobile-hide" width="300" height="auto" src="${trData[0].imgSrc}" style="display:block; max-width: 300px; width:100%;" alt="${trData[0].imgAlt}" border="0">                                
                        ${linkEndL}
                    </td>
                    </tr>            
            `
        }else{

            leftContent = trData[0].html
        }

        if(trData[1].contentType != 'fa-font'){
            rightContent = `
                    <tr>
                    <td align="center" style="padding: 0px 0px 0px 0px">
                        ${linkStartR}
                            <!--[if !mso 9]><!-->
                            <div class="mobile-show" width="100%" style="mso-hide: all; display:none; overflow: hidden; max-height: 0px; line-height:0;">
                            <img width="100%" src="${trData[1].imgSrc}" style="mso-hide:all;" alt="${trData[1].imgAlt}" border="0">
                            </div>
                            <!--<![endif]--> 
                            <img class="mobile-hide" width="300" height="auto" src="${trData[1].imgSrc}" style="display:block; max-width: 300px; width:100%;" alt="${trData[1].imgAlt}" border="0">                                
                        ${linkEndR}
                    </td>
                    </tr>           
            `
        }else{
            rightContent = trData[1].html
        }        

        html = `
    <tr>
        <th class="half-width" width="300" valign="top" background="${trData[0].imgSrc}" style="background: url('${trData[0].imgSrc}') top left / cover no-repeat; background-size: cover; height: inherit; width: 300px;">
            <table class="full-width" width="100%" border="0" cellpadding="0" cellspacing="0">
                <tbody>
                    ${leftContent}
                </tbody>
            </table>
        </th>

        <th class="half-width" width="300" valign="top" background="${trData[1].imgSrc}" style="background: url('${trData[1].imgSrc}') top left / cover no-repeat; background-size: cover; height: inherit; width: 300px;">
            <table class="full-width" width="100%" border="0" cellpadding="0" cellspacing="0">
                <tbody>
                    ${rightContent}
                </tbody>
            </table>
        </th>
    </tr>
`

    }

    if (columnType == "codeBlock" || columnType == "fa-font"){

        html = trData

    }

    return html;


}

function printDataString(){
    var dataString = JSON.stringify(globalBlock);
    $("#objString").val(dataString);
}

function setLiquid(){
    
    let block = globalBlock;
    errorMessages = [] //resetting error messages
    auLinks = ""; // resetting values
    nzLinks = ""; // resetting values
    outsideLinks = ""; // resetting values
    linksChecker = []; //resetting value
    tierLinks = {"goldTier":"","silverTier":"","bronzeTier":"","memberTier":""};


    for (let index = 0; index < block.length; index++) {
        const blocks = block[index].data;
  
        for (let x = 0; x < blocks.length; x++) {
            const tableTypes = blocks[x];
            
            for (let y = 0; y < tableTypes.data.length; y++) {
                const columnType = tableTypes.data[y];

                //make sure it is not codeblock
                if(columnType.columnType != "codeBlock"){
                    //check if one or two column
                    if (columnType.columnType == "twocolumn"){
                        
                        for (let a = 0; a < columnType.data.length; a++) {
                            let data = JSON.parse(columnType.data[a])

                            if(data.contentType == "fa-link"){
                                setVariables(data);
                            }  
                        }

                    }else{
                        //one column and link Only
                        let data = JSON.parse(columnType.data);

                        //only save if contentType is fa-link
                        if(data.contentType == "fa-link" || data.contentType == "fa-globe"){
                            setVariables(data);
                        }                    
                    }
                }
                
            }
            
        }
        
    }


}

function setVariables(d){
    let data = d;   
    let imgSrc = ''

    if(data.contentType == "fa-globe"){
        imgSrc = "dummySrc"
    }else{
        imgSrc = data.imgSrc
    }

    //check if slice, link, imgSrc and any of the deeplinks have values
    if(data.slice && data.link && imgSrc){
        if(!linksCheck(data.slice)){
            //if theres no duplciate,,save create variable

            //set data.link if its Base URL
            let baseURL = data.link.toLowerCase();

            //check actualLink and deepLink first
            if (data.actualLink || data.noDl){

                if(data.actualLink){
                    outsideLinks += `\t{% assign Link${data.slice} = ${data.link} %}\n`  
                }else{
                    if(baseURL == "{{baseurl}}"){
                        outsideLinks += `\t{% assign Link${data.slice} = BaseURL %}\n`
                    }else{
                        outsideLinks += `\t{% assign Link${data.slice} = BaseURL | append: '${data.link}' %}\n`
                    }
                }

            }else{
                //both unchecked, check if deeplinks have values

                //all tier have values
                
                if (data.goldTier && data.silverTier && data.bronzeTier && data.memberTier){
                    //AU
                    tierLinks.goldTier += `\t\t{% assign Link${data.slice} = '${data.goldTier}' %}\n`;
                    tierLinks.silverTier += `\t\t{% assign Link${data.slice} = '${data.silverTier}' %}\n`;
                    tierLinks.bronzeTier += `\t\t{% assign Link${data.slice} = '${data.bronzeTier}' %}\n`;
                    tierLinks.memberTier += `\t\t{% assign Link${data.slice} = '${data.memberTier}' %}\n`;

                }else{
                    //if any of the tier have value
                    if (data.goldTier || data.silverTier || data.bronzeTier || data.memberTier) {
                        //set variable here
                        let tierArray = [data.goldTier, data.silverTier, data.bronzeTier, data.memberTier];
                        let getLink = '';
                        for (let index = 0; index < tierArray.length; index++) {
                            const element = tierArray[index];
                            //if have value, save
                            if(tierArray[index]){
                                getLink = `\t{% assign Link${data.slice} = '${tierArray[index]}' %}\n`;
                            }
                            
                        }

                        auLinks += getLink;

                    }else{
                        //send error message
                        let message = `<b>[${data.id}]</b> <i>deeplinks</i> must have atleast 1 value`;
                        errorMessages.push(message);
                    }
                }

                if(baseURL == "{{baseurl}}"){
                    nzLinks += `\t{% assign Link${data.slice} = BaseURL %}\n`;
                }else{
                    nzLinks += `\t{% assign Link${data.slice} = BaseURL | append: '${data.link}' %}\n`;
                }

            }

            linksChecker.push(data.slice)

        }

    }else{
        //push to error message
        let message = `<b>[${data.id}]</b> have missing datas, please check if <i>Slice</i>, <i>Link</i>, or <i>ImgSrc</i> have value`;
        errorMessages.push(message);
    }

    //console.log(linksChecker)
    
}

function missingData(){
    //check if we have error messages

    if(errorMessages.length > 0){
        
        for (let index = 0; index < errorMessages.length; index++) {
            const msg = errorMessages[index];
            let htmlMsg = `<div class="alert alert-danger" role="alert">${msg}</div>`;
            //prepending the error messagees
            $("#errorPrep .sticky").prepend(htmlMsg);
        }

    }
}

function printLiquidscript(){

    let tier = '';
    //check if needed to add the tier  conditions

    if(tierLinks.goldTier.length > 0 && tierLinks.silverTier.length > 0 && tierLinks.bronzeTier.length > 0 && tierLinks.memberTier.length > 0){
        tier = `
\t{% comment %} Tiers Links {% endcomment %} 

\t{% case tier %}
\t{% when 'Gold' %}
${tierLinks.goldTier}
\t{% when 'Silver' %}
${tierLinks.silverTier}
\t{% when 'Bronze' %}
${tierLinks.bronzeTier}
\t{% else %}
${tierLinks.memberTier}
\t{% endcase %}   

        `
    }

    let deeplinks = `
{% comment %} Deep link code {% endcomment %}
<!--
{% assign clicktracking = 'clicktracking=off ' %}

{% if \${country} == 'Australia' or \${country} == 'AU' %}  
${tier}
${auLinks}
{% else %}

{% comment %} Set other countries links {% endcomment %}
${nzLinks}
{% endif %}

{% comment %} No Deep Links {% endcomment %}
${outsideLinks}
--> 
    `    
    
    $("#LiquidCode").text(deeplinks);
    adjustTextareaHeight( $("#LiquidCode")[0]);
}

function linksCheck(slice){

    let sliceID = slice
    let duplicates = false;
    let htmlWarning = '';

    
    for (let index = 0; index < linksChecker.length; index++) {

        if (linksChecker[index] == sliceID) {
            //theres a link duplicate
            duplicates = true;
            htmlWarning += `<div class="alert alert-warning" role="alert">Slice: ${linksChecker[index]} have duplicates, first link will be used</div>`
        }

    }

    $("#errorPrep .sticky").prepend(htmlWarning);
    return duplicates //return to check if theres duplicate
}

//copy html
$(document).on('click',"#copybuild",function(){
    // Get the HTML content of the source element
    var htmlContent = $('#previewContainer').html();
    // Create a temporary textarea element to hold the HTML content
    var tempTextarea = $('<textarea>').text($.trim(htmlContent)).css({
        position: 'fixed',
        top: 0,
        left: 0,
        opacity: 0
    });

    // Append the textarea to the body
    $('body').append(tempTextarea);

    // Select the text in the textarea
    tempTextarea.select();

    // Copy the selected text to the clipboard
    document.execCommand('copy');

    // Remove the temporary textarea
    tempTextarea.remove();

    // Optionally, provide feedback to the user
    alert('Email Html has been copied to the clipboard!');
});

//copy data string
$(document).on('click', "#copyDataString, #copyLiquidString", function() {
    // Get the string content of the source element
    let id = $(this).attr("id");
    let string = '';
    if(id == "copyDataString"){
        string = $("#objString").val().trim();
    }else{
        string = $("#LiquidCode").val().trim();
    }
     
    if (!string) {
        return;
    }

    // Use the Clipboard API to write the text to the clipboard
    navigator.clipboard.writeText(string).then(function() {
        alert('Data String has been copied to the clipboard!');
    }).catch(function(err) {
        console.error('Could not copy text: ', err);
        alert('Cannot copy the data, please contact the dev');
    });
});

// actual link and no deep link click events
$(document).on('click','.actualLink, .noDl',function(){
    let parent = $(this).closest(".fForm");
    let thisT = $(this).is(":checked");
    let other = '';
    let gold = parent.find(".goldDl");
    let silver = parent.find(".silverDl");
    let bronze = parent.find(".bronzeDl");
    let member = parent.find(".memberDl");

    if($(this).hasClass("actualLink")){
        other = $(this).closest(".fForm").find(".noDl").is(":checked");
    }else{
        other = $(this).closest(".fForm").find(".actualLink").is(":checked");
    }


    if(thisT || other){
  
        //means disable values, if there's a value, save it
        if($.trim(gold.val())){
            gold.attr("data-value",$.trim(gold.val())).val("");
        }

        if($.trim(silver.val())){
            silver.attr("data-value",$.trim(silver.val())).val("");
        }

        if($.trim(bronze.val())){
            bronze.attr("data-value",$.trim(bronze.val())).val("");
        }

        if($.trim(member.val())){
            member.attr("data-value",$.trim(member.val())).val("");
        }

        gold.attr("disabled","disabled");
        silver.attr("disabled","disabled");
        bronze.attr("disabled","disabled");
        member.attr("disabled","disabled");
        
    }else{
     
        //enable values
        if(gold.attr("data-value")){
            gold.val(gold.attr("data-value")).removeAttr("data-value")
        }

        if(silver.attr("data-value")){
            silver.val(silver.attr("data-value")).removeAttr("data-value")
        }

        if(bronze.attr("data-value")){
            bronze.val(bronze.attr("data-value")).removeAttr("data-value")
        }

        if(member.attr("data-value")){
            member.val(member.attr("data-value")).removeAttr("data-value")
        }

        gold.removeAttr("disabled");
        silver.removeAttr("disabled");
        bronze.removeAttr("disabled");
        member.removeAttr("disabled");
    }

});

function adjustTextareaHeight(el) {
    el.style.height = 'auto';
    el.style.height = (el.scrollHeight) + 'px';
}



// $(document).on('click','.btn-close',function(){
//     console.log("iim clciked")
// });