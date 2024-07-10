const btnSlide = $("#slidingDiv");
const divSelection = $("#contentSelection");
let isVisible = false; //state of div data
let isVisibleContent = false; //state of div selection
let globalHtml = {} //for live text and custom code
let globalBlock = [] //for blocks

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
  


$(".contentBuilder").sortable({
    revert: true
  });


// Adding Block
$(document).on('click','#addBlock',function(){
    //$(".toggle-button").click()
    //adding block
    const blockHtml = `<div dataid="${generateCode()}" class="block"><div class="controls"><i class="fa-solid fa-code buildIcon addCustom" title="Custom Code"></i><i class="fa-solid fa-table buildIcon addTable" title="Add Table"></i><i class="fa-solid fa-rectangle-xmark buildIcon redIcon removeParent" title="Remove Block"></i></div></div>`;

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

    if($(this).hasClass("fa-link")){
        formHTML =`
        <div class="col-6 nopad fForm" data-for="${dataId}" data-content="fa-link">
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
                        <input type="text" class="form-control link" placeholder="{{Base URL}} + Link" value="${(data) ? data.link : ''}">
        
                    </div>
                    <div class="input-group mb-2">
                        <span class="input-group-text">Img Src*</span>
                        <input type="text" class="form-control imgSrc" placeholder="Image Source" value="${(data) ?  data.imgSrc : ''}">
        
                    </div>
                    <div class="input-group mb-2">
                        <span class="input-group-text">Img Alt</span>
                        <input type="text" class="form-control imgAlt" placeholder="Image Alt" value="${(data) ? data.imgAlt : ''}">
        
                    </div>
                    <div class="input-group mb-2">
                        <span class="input-group-text gold">Deeplink*</span>
                        <input type="text" class="form-control goldDl" placeholder="Gold Deeplink" value="${(data) ? data.goldTier : ''}">
                    </div>
                    <div class="input-group mb-2">
                        <span class="input-group-text silver">Deeplink*</span>
                        <input type="text" class="form-control silverDl" placeholder="Silver Deeplink" value="${(data) ? data.silverTier : ''}">
                    </div>
                    <div class="input-group mb-2">
                        <span class="input-group-text bronze">Deeplink*</span>
                        <input type="text" class="form-control bronzeDl" placeholder="Bronze Deeplink" value="${(data) ? data.bronzeTier : ''}">
                    </div>
                    <div class="input-group mb-2">
                        <span class="input-group-text member">Deeplink*</span>
                        <input type="text" class="form-control memberDl" placeholder="Member Deeplink" value="${(data) ? data.memberTier : ''}">
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
    }else{
        originalContent = $('.openSelection[data-id="' + origElement.attr("data-for") + '"').find(".addData");
    }

    originalContent.attr("data-status","inactive");
});

//removing custom code
$(document).on("click",".removeCode",function(){
    let origElement = $(this).closest(".fForm");
    //removing the actual block
    $('.customBlock[data-id="' + origElement.attr("data-for") + '"').remove();

    //removing to global variable
    delete globalHtml[origElement.attr("data-for")];

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
            data.silveTier = $.trim(formParent.find(".silverDl").val());
            data.bronzeTier = $.trim(formParent.find(".bronzeDl").val());
            data.memberTier = $.trim(formParent.find(".memberDl").val());
            data.actualLink = formParent.find(".actualLink").is(':checked');
            data.noDl = formParent.find(".noDl").is(':checked');
            data.contentType = contentType;
            save = 1;

        }
    }

    if(contentType == "fa-image"){
        //if img src is not empty, then save
        if($.trim(formParent.find(".imgSrc").val())){
            data.imgSrc = $.trim(formParent.find(".imgSrc").val());
            data.imgAlt = $.trim(formParent.find(".imgAlt").val());
            data.contentType = contentType;
            save = 1;
        }
    }  
    
    if(contentType == "fa-font"){
        //if the textarea is not empty save
        if($.trim(formParent.find(".liveText").val())){
            data.html = $.trim(formParent.find(".liveText").val());
            data.contentType = contentType;
            save = 1;
        }
    }  

    if(contentType == "fa-code"){
        //saving to global variable
        if($.trim(formParent.find(".liveText").val())){
            globalHtml[parentID] = $.trim(formParent.find(".liveText").val());
            data.contentType = contentType;
            save = 1;
        }
        

    }     


    //changing status to inactive and adding the data
    let originalContent = ''
    if(contentType == "fa-code"){
        originalContent = $('.customBlock[data-id="' + parentID + '"');
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
    buildBlocks();
});

//.contentBuilder > .block(possible no children)(remove .controls) > .table or .customblock (remove .controls)(.table possible no content)
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

        });

        //check if needed savings in the globalblock
        if(innerBlock.length > 0){
            perBlock.type = "block";
            perBlock.data = innerBlock;
            globalBlock.push(perBlock);
        }
        
        
    });

    console.log(JSON.stringify(globalBlock));
}