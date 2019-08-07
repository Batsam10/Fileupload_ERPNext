# -*- coding: utf-8 -*-
# Copyright (c) 2019, Malvin Samanga and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
from frappe.model.document import Document
import frappe, json
from frappe.utils.file_manager import save_file
from frappe import _
from frappe.utils.background_jobs import enqueue

class Test(Document):
    #def save(self):
    #    self.queue_action("save")
    pass

@frappe.whitelist()
def attach_file_to_project(filedata, project_name):
    frappe.msgprint(_("Tapinda refresh after this message"))
    frappe.msgprint(_("filedata"))
    if filedata:
        fd_json = json.loads(filedata)
        fd_list = list(fd_json["files_data"])

        for fd in fd_list:
            frappe.msgprint(_("File uploading next"))
            fileurl = save_file(fd["filename"], fd["dataurl"],"Test", project_name, decode=True, is_private=1).file_url
            frappe.msgprint(_("File upload complete"))
            frappe.db.set_value("Test",project_name,"image_url",fileurl)
            #frappe.db.set_value("Test",project_name,"output","<img class='output' src='%s'>" %fileurl)
        #return fileurl
    else:
        frappe.msgprint(_("Error. Please contact Administrator!!!!"))
        #return ""

@frappe.whitelist()
def enqueue_attach_file_to_project(filedata, project_name):
    enqueue("fileupload.file_upload.doctype.test.test.attach_file_to_project",queue='long',is_async=False, now=True, filedata=filedata, project_name=project_name)
