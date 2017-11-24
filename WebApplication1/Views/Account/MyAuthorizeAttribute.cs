using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using System.Web.Http.Controllers;
using MobileWEBAPI.Models;
using System.Web.Http.Filters;
using System.Collections;
using System.Diagnostics;
using System.Threading;
using System.Web.Script.Serialization;
using System.Reflection;

namespace MobileWEBAPI.App_Start
{
    public class MyAuthorizeAttribute : AuthorizeAttribute
    {
        protected override void HandleUnauthorizedRequest(HttpActionContext actionContext)
        {
            var response = actionContext.Request.CreateResponse<ErrorModel>
                                    (new ErrorModel() { status =401});
            response.StatusCode = HttpStatusCode.Unauthorized;

            actionContext.Response = response;
        }
    }

    public class ValidateFilterAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuted(HttpActionExecutedContext actionExecutedContext)
        {
            var objectContent = actionExecutedContext.Response.Content as ObjectContent;
            if (objectContent != null)
            {
                var type = objectContent.ObjectType; //type of the returned object
                var value = objectContent.Value; //holding the returned value

                //  var json = new JavaScriptSerializer().Serialize(value);


             //   var x = CheckProperty(value.GetType().GetProperty("data"));
                Type myType = value.GetType();
                IList<PropertyInfo> props = new List<PropertyInfo>(myType.GetProperties());

                foreach (PropertyInfo prop in props)
                {
                    IList<PropertyInfo> props1 = new List<PropertyInfo>(prop.GetType().GetProperties());
                    foreach (PropertyInfo p in props1)
                    {
                        object propValue = p.GetValue(prop, null);
                        var manoj = p.Name;
                    }

                    // Do something with propValue
                }
              


                var allprop = value.GetType().GetProperties();
                var prop14 = allprop[0].GetType().GetProperties();

                foreach (var check in prop14)
                {
                    PropertyInfo mi = check.GetType().GetProperty("Email");
                    if (mi != null)
                    {
                        mi.SetValue(Convert.ToString(mi.GetValue("Email")).ToDecrypt(), value);
                    }
                }

                PropertyInfo pi = prop14.GetType().GetProperty("Email");
                if (pi != null)
                {
                    pi.SetValue(Convert.ToString(pi.GetValue("Email")).ToDecrypt(), value);
                }

                (actionExecutedContext.ActionContext.Response.Content as ObjectContent).Value = value;
            }

            base.OnActionExecuted(actionExecutedContext);

        }

      

        public Object CheckProperty(Object value)
        {
            var allprops = value.GetType().GetProperties();
            foreach (var y in allprops)
            {
                if (y.GetType().GetProperties().Count() == 0)
                {
                    PropertyInfo pi = y.GetType().GetProperty("Email");
                    if (pi != null)
                    {
                        pi.SetValue(Convert.ToString(pi.GetValue("Email")).ToDecrypt(), y);
                    }
                }
                else
                {
                    CheckProperty(y);
                }
            }
            return value;
        }
    }
   

    public class MyError
    {
        public string status { get; set; }
    }
}