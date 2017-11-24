using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using CorporateAdmin.DLL;
using TWCCorporateAdmin.Models;
using MobileWEBAPI.Common;
using System.Web.Http.Cors;

namespace TWCCorporateAdmin.Controllers
{
    public class CorporateController : ApiController
    {
        readonly E2apWellness2Entities _context; // = new E2apWellness2Entities();

        readonly static string _cdnSaveImageUrl = System.Configuration.ConfigurationManager.AppSettings["saveImagesOnCDN"];
        readonly static string _cdnGetImageUrl = System.Configuration.ConfigurationManager.AppSettings["getImagesFromCDN"];
        readonly string _ChallengeImagePath = _cdnSaveImageUrl + "ChallengeImage/";
        readonly string _deployLocation = System.Configuration.ConfigurationManager.AppSettings["Location"];
        readonly string _CoroporateTeamplate = System.Configuration.ConfigurationManager.AppSettings["CorporateTeamplates"];
                
        /// <summary>
        /// Added By : Vikas Soni : 26 Oct, 2017
        /// Purpose    : To call dispose for _context
        /// </summary>

        public CorporateController()
        {
            this._context = new E2apWellness2Entities();
        }

        protected override void Dispose(bool disposing)
        {
            if (_context != null)
                _context.Dispose();
            base.Dispose(disposing);
        }

        [HttpPost]
        public HttpResponseMessage AddNewCorporate(AddNewCorporateModel model)
        {
            string fileName;
            bool IsDump = true;
            if (model.CorporateInfo_IsDump != 1)
            {
                IsDump = false;
            }
            if (string.IsNullOrEmpty(model.corporateLogo) || string.IsNullOrEmpty(model.filetype))
            {
                fileName = model.ImageName;
            }
            else
            {
                fileName = Guid.NewGuid() + "." + model.filetype.Split('/').ToList().LastOrDefault();
                try
                {                    
                    // changes for save on cdn : Santosh Sharma on 04-10-2017
                    if (_deployLocation == "live")
                    {
                        //CommonFunctions.UploadFileOnAmazon("ChallengeImage", path, fileName);
                        CommonFunctions.UploadFileOnAmazon(model.corporateLogo, fileName, "ChallengeImage");
                    }
                    else
                    {
                        string path = System.Configuration.ConfigurationManager.AppSettings["CorporateImage"] + fileName;
                        File.WriteAllBytes(path, Convert.FromBase64String(model.corporateLogo));
                    }
                }
                catch (Exception ex)
                {
                    CommonFunctions.WriteError("AddNewCorporate:" + ex.Message);
                    return Request.CreateResponse(HttpStatusCode.OK, new { status = -1 });
                }
            }

            var corporate = _context.SaveCorporateDetails_TWC(model.CorporateInfoID, model.corporateName, model.corporateLocation,
                model.corporateAddress, model.subdomain, fileName, model.dietitian, model.counsellor, model.doctor,
                model.UserID, model.isUpdate, IsDump, model.CorporateInfo_RegLimit).FirstOrDefault();

            return Request.CreateResponse(HttpStatusCode.OK, new { status = corporate });

        }

        [HttpPost]
        public HttpResponseMessage AddCorporateMessage(CEOMessage model)
        {

            try
            {
                CommonFunctions.WriteError("1):-- ");

                var exiests = System.IO.Directory.Exists(_CoroporateTeamplate + model.CorporateName);

                CommonFunctions.WriteError("2):-- ");

                if (!exiests)
                {

                    try
                    {

                        CommonFunctions.WriteError(" 3 exiest):-- ");

                        //Now Create all of the directories
                        foreach (string dirPath in Directory.GetDirectories(_CoroporateTeamplate + "CorporateDefaultTemplate", "*",
                            SearchOption.AllDirectories))
                            Directory.CreateDirectory(dirPath.Replace(_CoroporateTeamplate + "CorporateDefaultTemplate", _CoroporateTeamplate + model.CorporateName));

                        CommonFunctions.WriteError("4) create all of the directiry:-- ");

                        //Copy all the files & Replaces any files with the same name
                        foreach (string newPath in Directory.GetFiles(_CoroporateTeamplate + "CorporateDefaultTemplate", "*.*",
                            SearchOption.AllDirectories))
                            File.Copy(newPath, newPath.Replace(_CoroporateTeamplate + "CorporateDefaultTemplate", _CoroporateTeamplate + model.CorporateName), true);

                        CommonFunctions.WriteError("5) copyed all the directory:-- ");
                    }
                    catch (Exception ex)
                    {

                        CommonFunctions.WriteError("Eror in create Directory:--" + ex.Message + "||" + ex.StackTrace);
                    }
                }


                if (string.IsNullOrEmpty(model.ceoImage))
                {

                    return Request.CreateResponse(HttpStatusCode.OK, new { status = -1 });
                }
                if (string.IsNullOrEmpty(model.filetype))
                {

                    return Request.CreateResponse(HttpStatusCode.OK, new { status = -1 });
                }

                string fileName = "Ceo.jpg";

                CommonFunctions.WriteError("6) Image file name:--" + fileName);

                try
                {

                    string path = _CoroporateTeamplate + model.CorporateName + "/img/" + fileName;
                    CommonFunctions.WriteError("_______________" + path);
                    File.WriteAllBytes(path, Convert.FromBase64String(model.ceoImage));

                    CommonFunctions.WriteError("7) Write to this path:--" + path);
                }
                catch (Exception ex)
                {
                    CommonFunctions.WriteError("Copy corporaate html:-- " + ex.Message);
                    return Request.CreateResponse(HttpStatusCode.OK, new { status = -1 });
                }

                CommonFunctions.WriteError("8) index started :--");
                string indexpage =
                    File.ReadAllText(_CoroporateTeamplate + "CorporateDefaultTemplate/index.html");

                CommonFunctions.WriteError("9) index file pick in string:--");

                var corporateInfoID = Convert.ToInt32(model.CorporateinfoID);


                CommonFunctions.WriteError("10) index file pick in string:--" + corporateInfoID);


                var imagename = _context.CorporateInfoes.FirstOrDefault(x => x.CorporateInfoID == corporateInfoID).CorporateInfo_ImageName;

                CommonFunctions.WriteError("11) Get image name:--" + imagename);

                indexpage = indexpage.Replace("[CorporateLogo]", System.Configuration.ConfigurationManager.AppSettings["CorporateImageURL"] + imagename);
                indexpage = indexpage.Replace("[CEOImage]", fileName);
                indexpage = indexpage.Replace("[MessageHeader]", model.messageHeader);
                indexpage = indexpage.Replace("[Message]", model.message);
                indexpage = indexpage.Replace("[CorporateinfoID]", "<input type='hidden' id='CorporateinfoID' value='" + model.CorporateinfoID + "'/>");

                CommonFunctions.WriteError("12) Replaced string:--");

                System.IO.File.WriteAllText(_CoroporateTeamplate + model.CorporateName + "/index.html", indexpage);

                CommonFunctions.WriteError("13) Write all the text to path:--" + _CoroporateTeamplate + model.CorporateName + "/index.html");

                //try
                //{
                //    CommonFunctions.CreateVirtualDirecty(_CoroporateTeamplate + model.CorporateName, model.CorporateName);
                //    CommonFunctions.WriteError("Virtual directory successfully created. ");
                //}
                //catch (Exception ex)
                //{

                //    CommonFunctions.WriteError("ERROR:-- Create Virtual Directory:-- " + ex.Message);
                //}



                return Request.CreateResponse(HttpStatusCode.OK, new { status = exiests });
            }
            catch (Exception ex)
            {
                CommonFunctions.WriteError("CorporateMessage:-- " + ex.Message + "|" + ex.StackTrace);
                return Request.CreateResponse(HttpStatusCode.OK, new { status = -1 });
            }

        }

        [HttpPost]
        public HttpResponseMessage ListCorporate()
        {
            var result = _context.Admin_CorporateList().ToList();
            return Request.CreateResponse(HttpStatusCode.OK, new { Data = result });
        }
        [HttpPost]
        public HttpResponseMessage CheckRegisterLimit(CommonModel model)
        {
            try
            {
                int result = _context.Members.Where(x => x.Member_CorporateInfoID == model.corporateInfoID && x.Member_IsActive == true).Count();
                //if (model.PageSize <= result)
                //{
                //    return Request.CreateResponse(HttpStatusCode.OK, new { result = result });
                //}
                return Request.CreateResponse(HttpStatusCode.OK, new { result = result });
            }
            catch (Exception ex)
            {
                CommonFunctions.WriteError("Corporate: CheckRegisterLimit :---" + ex.Message + "||" + ex.StackTrace);
                return Request.CreateResponse(HttpStatusCode.OK, new { result = -1 });
            }
        }
        [HttpPost]
        public HttpResponseMessage GetCorporateInfo(CommonModel model)
        {
            var result =
                _context.CorporateInfoes.Where(
                    x => x.CorporateInfo_IsActive == true && x.CorporateInfoID == model.corporateInfoID)
                    .Join(_context.Corporates.Where(x => x.Corporate_IsActive == true), x => x.CorporateInfoID,
                        y => y.Corporate_CorporateInfoID, (x, y) => new GetCorporateInfoModel()
                        {
                            CorporateName = x.CorporateInfo_Name,
                            Location = y.Corporate_Location,
                            Address = "",
                            SubDomain = x.CorporateInfo_SubDomain,
                            DietitianID = y.Corporate_DietitianID,
                            CounsellorId = y.Corporate_CounsellorId ?? 0,
                            DoctorID = y.Corporate_DoctorID ?? 0,
                            ImageName = x.CorporateInfo_ImageName,
                            ImageURL = x.CorporateInfo_ImageName,
                            IsDump = x.CorporateInfo_IsDump,
                            RegLimit = x.CorporateInfo_RegLimit == null ? 0 : x.CorporateInfo_RegLimit.Value
                        }).FirstOrDefault();

            if (result != null)
            {
                var checkcorporatemanager = _context.CorporateAdmin_UserCorporate.Where(x => x.CorporateAdmin_Role.RoleID == 3 && x.Corporate == model.corporateInfoID.ToString() && x.IsActive == true).FirstOrDefault();

                if (checkcorporatemanager != null)
                {
                    var managerInfo = _context.Members.Where(x => x.MemberID == checkcorporatemanager.MemberID && x.Member_IsActive == true).FirstOrDefault();
                    if (managerInfo != null)
                    {
                        result.CorporateManagerName = managerInfo.Member_FirstName.ToDecrypt() + " " + managerInfo.Member_LastName.ToDecrypt();
                        result.CorporateManagerEmail = managerInfo.Member_Email.ToDecrypt();
                    }
                    else
                    {
                        result.CorporateManagerName = "0";
                        result.CorporateManagerEmail = "0";
                    }
                }
                else
                {
                    result.CorporateManagerName = "0";
                    result.CorporateManagerEmail = "0";
                }
                // changes for cdnUrl : Santosh Sharma on 04-10-2017
                result.ImageURL = string.IsNullOrEmpty(result.ImageURL)
                    ? ""
                    : _deployLocation == "live" ? (_cdnGetImageUrl + "ChallengeImage/" + result.ImageURL) : System.Configuration.ConfigurationManager.AppSettings["CorporateImageURL"] + result.ImageURL;

                result.RegisteredUsers = _context.Members.Where(x => x.Member_CorporateInfoID == model.corporateInfoID && x.Member_IsActive == true).Count();

                return Request.CreateResponse(HttpStatusCode.OK, new { result });
            }

            return Request.CreateResponse(HttpStatusCode.OK, new { status = -1 });
        }

        [HttpPost]
        public HttpResponseMessage GetCorporateAddOnFeature(CommonModel model)
        {
            try
            {
                var result = _context.GetCorporateAddOnFeature(model.corporateInfoID).FirstOrDefault();


                CommonFunctions.WriteError("Corporate: GetCorporateAddOnFeature:---CorporateInfoID" + model.corporateInfoID);

                return Request.CreateResponse(HttpStatusCode.OK, new { result = result });

            }
            catch (Exception ex)
            {
                CommonFunctions.WriteError("Corporate: GetCorporateAddOnFeature:---" + ex.Message + "||" + ex.StackTrace);
                return Request.CreateResponse(HttpStatusCode.OK, new { result = -1 });
            }
        }


        [HttpPost]
        public HttpResponseMessage SaveCorporateAddOnFeature(SaveCorporateAddOnFeatureModel model)
        {
            try
            {
                var result = _context.SaveCorporateAddOnFeature(model.CorporateinfoID, model.GuidedPrograms,
                model.DietPlanBasic, model.NutritionistApp, model.NutritionistChat, model.CounsellorApp,
                model.CounsellorChat, model.DoctorApp, model.DoctorChat, model.Teams, model.Community,
                model.HealthyBenefits, model.PremiumDashboard, model.FoodCard, model.ActivityCard, model.ProgramAutoJoin,
                model.RunWithFriend, model.Challenges, model.HealthOpinion, model.InterestGroups).FirstOrDefault();

                return Request.CreateResponse(HttpStatusCode.OK, new { status = result });
            }
            catch (Exception ex)
            {
                CommonFunctions.WriteError("Corporate: SaveCorporateAddOnFeature:---" + ex.Message + "||" + ex.StackTrace);

                return Request.CreateResponse(HttpStatusCode.OK, new { status = -1 });
            }
        }
        [HttpPost]
        public HttpResponseMessage GetCorporateScoreForDashboard(CommonModel model)
        {

            try
            {
                var result = _context.GetCorporateScoreForDashboard(model.CorporateName).FirstOrDefault();
                return Request.CreateResponse(HttpStatusCode.OK, new { data = result });
            }
            catch (Exception)
            {
                return Request.CreateResponse(HttpStatusCode.OK, new { data = -1 });
            }
        }

        /// <summary>
        /// Created By : Santosh Sharma : 06-10-17
        /// Purpose    : Getting Step Challenge Detail and Enrolled Team or Members and their steps List. 
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [EnableCors(origins: "*", headers: "*", methods: "*")]
        [HttpPost]
        public HttpResponseMessage GetChallengeStepForLeaderBoard(CommonModel model)
        {
            try
            {
                int _stepChallengeId = string.IsNullOrEmpty(model.StepChallengeId) ? 0 : Convert.ToInt32(model.StepChallengeId.ToDecrypt());
                if (_stepChallengeId > 0)
                {
                    var table0 = new GetChallengeStepForLeaderBoard_Result();
                    List<GetChallengeStepForLeaderBoardStepsDtl_Result> table1 = new List<GetChallengeStepForLeaderBoardStepsDtl_Result>();

                    var data = _context.GetChallengeStepForLeaderBoard(_stepChallengeId, model.TeamID);
                    table0 = data.FirstOrDefault();
                    table1 = data.GetNextResult<GetChallengeStepForLeaderBoardStepsDtl_Result>().ToList();
                    
                    if (model.TeamID > 0)
                    {
                        var table = table1.Select(x => new
                        {
                            RowNumber = x.RowNumber,
                            StepChallengeTeamID = x.StepChallengeTeamID,
                            Name = x.Name.ToDecrypt(),
                            TotalSteps = x.TotalSteps,
                            AvgSteps = x.AvgSteps
                        }).ToList();

                        var modelData = new { readingValues = table0, stepList = table };
                        return Request.CreateResponse(HttpStatusCode.OK, new { status = 0, data = modelData });
                    }
                    else if (table0.SC_ChallengeType == 2)
                    {
                        var table = table1.Select(x => new
                        {
                            RowNumber = x.RowNumber,
                            StepChallengeTeamID = x.StepChallengeTeamID,
                            Name = x.Name.ToDecrypt(),
                            TotalSteps = x.TotalSteps,
                            AvgSteps = x.AvgSteps
                        }).ToList();

                        var modelData = new { readingValues = table0, stepList = table };
                        return Request.CreateResponse(HttpStatusCode.OK, new { status = 0, data = modelData });
                    }
                    else
                    {
                        var modelData = new { readingValues = table0, stepList = table1 };
                        return Request.CreateResponse(HttpStatusCode.OK, new { status = 0, data = modelData });
                    }
                }
                else
                {
                    return Request.CreateResponse(HttpStatusCode.OK, new { status = 0, data = new { } });
                }
            }
            catch (Exception ex)
            {
                CommonFunctions.WriteError(ex, "CorporateController", "GetChallengeStepForLeaderBoard");
                return Request.CreateResponse(HttpStatusCode.OK, new { status = -1 });
            }
        }

    }
}
