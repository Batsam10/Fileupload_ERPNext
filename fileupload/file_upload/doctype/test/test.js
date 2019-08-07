// Copyright (c) 2019, Malvin Samanga and contributors
// For license information, please see license.txt

function setupReader(file, input) {
      var name = file.name;
      var reader = new FileReader();
      reader.onload = function(e) {
      input.filedata.files_data.push({
        "__file_attachment": 1,
        "filename": file.name,
        "dataurl": reader.result
      })
       $(".output").attr("src",reader.result);
    }

    reader.readAsDataURL(file);
  }

frappe.ui.form.on('Test', {
  refresh: function(frm){//figure out how to restrict  ot images
    var filedata  =$(".input_file").prop('filedata');
    var projname = cur_frm.doc.name;
    $(".output").attr("src",frappe.model.get_value("Test",projname,"image_url"));
    var html_string_placeholder = '<input class="input_file" type="file" style="display: none;" multiple>';
    cur_frm.set_df_property('input_file', 'options', html_string_placeholder);
    cur_frm.refresh_field('upload_file_placeholder');
    },

   select_file: function(frm){
    $('.input_file').click();
     frm.toggle_display("upload_image", true);
   },


    upload_image: function(frm){
      $(".upload_image").addClass("hidden");
      $(".select_file").addClass("hidden");
      var $input = $('.input_file');
      var input = $input.get(0);
      if(input.files.length){
         input.filedata = { "files_data" : [] }; //Initialize as json array.
         window.file_reading = true;
         $.each(input.files, function(key, value) {
            setupReader(value, input);
          });
         window.file_reading = false;
       }
       else{
         frappe.msgprint("You need to select a file to proceed");
       }

  },

  save_doc: function(frm){//actual uploading
      var filedata  =$(".input_file").prop('filedata');
      var projname = cur_frm.doc.name;
      if(filedata){
         frappe.msgprint(__("This is when the Frappe call happens. try refressh page"));
        frappe.call({
          method: "fileupload.file_upload.doctype.test.test.attach_file_to_project",
          aysnc: false,
          args: {
                  "filedata": filedata,
                  "project_name": projname
                },
          //freeze: true,
          //freget_datetime_streze_message: __("Upload files..."),
          callback: function(r){
            if(!r.exc) {
             frappe.msgprint(__("Files uploaded"));
            // frm.set_value("image_url",r.message);
              //$(".output").attr("src",frappe.model.get_value("Test",projname,"image_url"));
            } else {
              frappe.msgprint(__("Files not uploaded. <br /> " + r.exc));
            }
          }
        });
      }
      else{
        frappe.msgprint(__("Please select a file and save. <br /> "));
      }


}
});
