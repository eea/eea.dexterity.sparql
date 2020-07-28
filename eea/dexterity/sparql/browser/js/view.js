if (window.EEASparql === undefined){
  var EEASparql = {version: '1.0'};
}

/* EEASparql.Preview
*/
EEASparql.Preview = function(context, options){
  var self = this;
  self.context = context;
  self.settings = {};

  if(options){
    jQuery.extend(self.settings, options);
  }

  self.initialize();
};

EEASparql.Preview.prototype = {
  initialize: function(){
    var self = this;
    self.overlay = jQuery('#eea-sparql-overlay');
    if(!self.overlay.length){
      self.overlay = jQuery('<div>')
        .attr('id', 'eea-sparql-overlay')
        .append(jQuery('<div>').addClass('contentWrap'))
        .appendTo(jQuery('body'));
    }

    self.context.attr('rel', '#eea-sparql-overlay');
    self.context.overlay({
      mask: 'black',
      onBeforeLoad: function() {
        var wrap = this.getOverlay().find('.contentWrap');
        wrap.load(this.getTrigger().attr("href") + '/@@sparql.preview');
      },
      onClose: function(){
        var wrap = this.getOverlay().find('.contentWrap');
        wrap.html('<div class="loading">Loading preview...</div>');

      }
    });
  }
};

/* jQuery plugin for EEASparql.Preview
*/
jQuery.fn.EEASparqlPreview = function(options){
  return this.each(function(){
    var context = jQuery(this).addClass('eea');
    var preview = new EEASparql.Preview(context, options);
    context.data('EEASparqlPreview', preview);
  });
};


function preview_sparql() {
    var ajax_data = {
            "endpoint" : jQuery('#form-widgets-endpoint_url').prop('value'),
            "timeout" : jQuery("#form-widgets-timeout").prop("value"),
            "arg_spec" : "",
            "sparql_query" : jQuery("#form-widgets-sparql_query").prop("value")
    };
    var preview_arguments = jQuery(".sparql-preview-arguments").prop("value");
    var args_list = preview_arguments.split("&");
    jQuery.each(args_list, function(idx, arg) {
        args = arg.split("=");
        ajax_data[args[0]] = args[1];
    });
    // var argspec = jQuery("input[name='arg_spec.name:records']");
    var argspec = jQuery('#form-widgets-arg_spec input.text-widget');
    jQuery.each(argspec, function(idx, spec) {
        value = jQuery(spec).prop("value");
        if (value) {
            ajax_data.arg_spec += value + " ";
        }
    });

    var loading_msg = jQuery(
        "<div class='sparql-preview-loading'>" +
        "<div>Executing query...</div></div>");
    jQuery(loading_msg).appendTo("body");
    jQuery.ajax({
        url: portal_url + "/sparql.quick_preview",
        type: "POST",
        data: ajax_data,
        success: function(data) {
            jQuery(".sparql-preview-loading").remove();
            var sparql_preview = jQuery("<div class='sparql_preview'></div>");
            jQuery(data).appendTo(sparql_preview);
            sparql_preview.dialog({
                title: "Preview for " + jQuery("#title").prop("value"),
                modal: true,
                width: 'auto',
                create: function() {
                    $(this).css("maxHeight", 600);
                    $(this).css("maxWidth", 800);
                }
            });
        }
    });
}

function sparql_setstatic() {
    if (jQuery("#form-widgets-sparql_static input").prop("checked")) {
        jQuery("#form-widgets-endpoint_url").attr("readonly", true);
        jQuery("#form-widgets-timeout").attr("disabled", true);
        jQuery("#form-widgets-arg_spec").attr("readonly", true);
        jQuery("#form-widgets-sparql_query").attr("readonly", true);

        jQuery("#form-widgets-endpoint_url").addClass("sparql-readonly-field");
        jQuery("#form-widgets-arg_spec").addClass("sparql-readonly-field");
        jQuery("#form-widgets-sparql_query").addClass("sparql-readonly-field");
    }
    else {
        jQuery("#form-widgets-endpoint_url").attr("readonly", false);
        jQuery("#form-widgets-timeout").attr("disabled", false);
        jQuery("#form-widgets-arg_spec").attr("readonly", false);
        jQuery("#form-widgets-sparql_query").attr("readonly", false);
        jQuery(".sparql-readonly-field").removeClass("sparql-readonly-field");
    }
}

function check_relations() {
    if (window.location.href.indexOf("portal_factory") !== -1) {
        return;
    }
    jQuery.ajax({
        url: absolute_url + "/sparql.related_items",
        type: "GET",
        success: function(data) {
            var back_rels = JSON.parse(data);
            if (back_rels.length !== 0) {
                var warningMessage = jQuery(
                    '<dl class="portalMessage warning">' +
                        '<dt>Warning</dt>' +
                        '<div style="clear:both"></div' +
                        '<dd>' +
                            'The result of this query is used by:' +
                            '<ul class="sparql-back-relations"></ul>' +
                            'Modifying the query may cause problems in them.' +
                        '</dd>' +
                    '</dl>');
                jQuery("#sparql-base-edit").prepend(warningMessage);
                jQuery.each(back_rels, function(idx, rel) {
                    var rel_msg = jQuery(
                        '<li><a href="' + rel[1] + '">' + rel[0] + '</a></li>'
                    );
                    rel_msg.appendTo(".sparql-back-relations");
                });
            }
        }
    });

}
jQuery(document).ready(function($) {
    jQuery(".sparql-query-results-preview").click(preview_sparql);
    jQuery("#form-widgets-sparql_static").click(sparql_setstatic);
    sparql_setstatic();
    check_relations();
});
