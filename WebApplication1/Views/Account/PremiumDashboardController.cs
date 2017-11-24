using System;
using System.Collections.Generic;
using System.Data.Entity.Core.Objects;
using System.Globalization;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using MobileWEBAPI.DAL;
using MobileWEBAPI.DAL.Model;
using MobileWEBAPI.Models;
using MobileWEBAPI.App_Start;
using MobileWEBAPI.Common;
using MobileWEBAPI.DAL.Repository;
using System.Threading.Tasks;
using System.Web.Mail;
using System.Web;
using System.Xml.Linq;


namespace MobileWEBAPI.Controllers
{
    [MyAuthorizeAttribute]
    [ValidateFilterAttribute]
    public class PremiumDashboardController : ApiController
    {
        #region Global fields and objects
        private E2APV2Entities _context;
        private readonly PremiumDashboardRepository _premiumDashboardRepository;

        #endregion

        public PremiumDashboardController()
        {
            _context = new E2APV2Entities();
            _premiumDashboardRepository = new PremiumDashboardRepository(_context);

        }

        protected override void Dispose(bool disposing)
        {
            if (_context != null)
            {
                _context.Dispose();
            }
            if (_premiumDashboardRepository != null)
            {
                _premiumDashboardRepository.Dispose();
            }
            base.Dispose(disposing);
        }

        [HttpPost]
        public HttpResponseMessage GetDashboardRecommendationStages(PremiumDashboardModel model)
        {
            try
            {
                if (model.MemberID > 0)
                {
                    var data = _premiumDashboardRepository.GetDashboardRecommendationStages(model.MemberID);
                    var memberPersonalInfo = _context.Members.Where(x => x.MemberID == model.MemberID)
                                                .Select(t => new
                                                {
                                                    FirstName = t.Member_FirstName,
                                                    LastName = t.Member_LastName,
                                                    Height = t.Member_Height,
                                                    Weight = t.Member_Weight,
                                                    LastTrackedWeight = _context.Vital_Weight.Where(v => v.WTMemberID == model.MemberID).OrderByDescending(m => m.WTID).Select(s => s.WTValue).FirstOrDefault(),
                                                    UserImage = t.Member_Image
                                                }).ToList();
                    var memberPersonalInfoData = memberPersonalInfo.Select(u => new
                                                  {
                                                      FirstName = u.FirstName.ToDecrypt(),
                                                      LastName = u.LastName.ToDecrypt(),
                                                      Height = u.Height,
                                                      Weight = u.Weight,
                                                      LastTrackedWeight = u.LastTrackedWeight,
                                                      UserImage = System.Configuration.ConfigurationManager.AppSettings["MemberImagePath"] + u.UserImage
                                                  }).FirstOrDefault();
                    ;

                    var modelData = new { data = data, MemberInfo = memberPersonalInfoData };
                    return Request.CreateResponse(HttpStatusCode.OK, new { status = 0, Data = modelData });
                }
                else
                {
                    return Request.CreateResponse(HttpStatusCode.OK, new { status = 0, Data = new { } });
                }
            }
            catch (Exception ex)
            {
                CommonFunctions.WriteError(ex.StackTrace, "PremiumDashboard", "GetDashboardRecommendationStages");
                return Request.CreateResponse(HttpStatusCode.OK, CommonFunctions.ReturnError());
            }
        }

        [HttpPost]
        public HttpResponseMessage GetPopularProgram(PremiumDashboardModel model)
        {
            try
            {
                if (model.MemberID > 0)
                {
                    var data = _premiumDashboardRepository.GetDashboardRecommendationPopularProgram(model.MemberID).Select(x => new
                    {
                        x.Workshop_Category,
                        x.Workshop_Duration,
                        x.Workshop_ID,
                        x.Workshop_Name,
                        x.Workshop_Slug,
                        Workshop_Image = System.Configuration.ConfigurationManager.AppSettings["ProgramsImagePath"] + x.Workshop_Image
                    }).ToList();
                    return Request.CreateResponse(HttpStatusCode.OK, new { status = 0, Data = data });
                }
                else
                {
                    return Request.CreateResponse(HttpStatusCode.OK, new { status = 0, Data = new { } });
                }

            }
            catch (Exception ex)
            {
                CommonFunctions.WriteError(ex.StackTrace, "PremiumDashboard", "GetDashboardRecommendationPopularProgram");
                return Request.CreateResponse(HttpStatusCode.OK, CommonFunctions.ReturnError());
            }
        }

        [HttpPost]
        public HttpResponseMessage GetPopularChallenges(PremiumDashboardModel model)
        {
            try
            {
                if (model.MemberID > 0)
                {
                    var data = _premiumDashboardRepository.GetDashboardRecommendationPopularChallenges(model.MemberID).Select(x => new
                    {
                        x.Challenge_Description,
                        x.Challenge_Duration,
                        x.Challenge_ID,
                        x.Challenge_Name,
                        x.Challenge_Category,
                        x.MemberCount,
                        Challenge_Image = System.Configuration.ConfigurationManager.AppSettings["ChallengesImagePath"] + x.Challenge_Image
                    }).ToList();

                    return Request.CreateResponse(HttpStatusCode.OK, new { status = 0, Data = data });
                }
                else
                {
                    return Request.CreateResponse(HttpStatusCode.OK, new { status = 0, Data = new { } });
                }
            }
            catch (Exception ex)
            {
                CommonFunctions.WriteError(ex.StackTrace, "PremiumDashboard", "GetDashboardRecommendationPopularChallenges");
                return Request.CreateResponse(HttpStatusCode.OK, CommonFunctions.ReturnError());
            }
        }

        [HttpPost]
        public HttpResponseMessage GetAutoDietPlan(PremiumDashboardModel model)
        {
            try
            {
                if (model.MemberID > 0)
                {
                    var data = _premiumDashboardRepository.GetAutoDietPlanForMember(model.MemberID).Select(x => new
                    {
                        DietPlanID = x.DietPrescriptionID,
                        DietPlanName = x.DietPlanName ?? "",
                        ActiveByUser = x.DietPlanStatus == 2 ? 1 : 0,
                        Date = string.IsNullOrEmpty(x.ActivationDate) ? x.DietPlanSentOn : Convert.ToDateTime(x.ActivationDate),
                        TargetCalories = x.DietPlanTargetCalorie,
                        Label = "Current",
                        Days = x.Days ?? 0
                    }).FirstOrDefault();
                    return Request.CreateResponse(HttpStatusCode.OK, new { status = 0, Data = data });
                }
                else
                {
                    return Request.CreateResponse(HttpStatusCode.OK, new { status = 0, Data = new { } });
                }

            }
            catch (Exception ex)
            {
                CommonFunctions.WriteError(ex.StackTrace, "PremiumDashboard", "GetAutoDietPlan");
                return Request.CreateResponse(HttpStatusCode.OK, CommonFunctions.ReturnError());
            }
        }


        [HttpPost]
        public HttpResponseMessage GetStressManagementQuestionAnswer(PremiumDashboardModel model)
        {
            try
            {
                if (model.MemberID > 0)
                {
                    List<GetStessManagementCategoryList_Result> categoryList = new List<GetStessManagementCategoryList_Result>();
                    List<GetStessManagementQuestionList_Result> questionList = new List<GetStessManagementQuestionList_Result>();
                    List<GetStessManagementAnswerList_Result> answerList = new List<GetStessManagementAnswerList_Result>();

                    StressManagementModel objModel = new StressManagementModel();

                    _premiumDashboardRepository.GetStressManagementQuestionAnswer(out categoryList, out questionList, out answerList);

                    objModel.CategoryList = categoryList;
                    objModel.QuestionList = questionList;
                    objModel.AnswerList = answerList;

                    var maxAnswerList = answerList.GroupBy(x => x.Question_ID, (key, xs) => xs.OrderByDescending(x => x.Answer_Point).First().Answer_Point);

                    //objModel.TotalPoints = Convert.ToInt32(maxAnswerList.Sum());

                    //objModel.TotalPoints=answerList.GroupBy(x=>x.Question_ID).Max(t=>t.Answer_Point)
                    return Request.CreateResponse(HttpStatusCode.OK, new { status = 0, Data = objModel });
                }
                else
                {
                    return Request.CreateResponse(HttpStatusCode.OK, new { status = 0, Data = new { } });

                }
            }
            catch (Exception ex)
            {
                CommonFunctions.WriteError(ex.StackTrace, "PremiumDashboard", "GetStessManagementQuestionAnswer");
                return Request.CreateResponse(HttpStatusCode.OK, CommonFunctions.ReturnError());
            }
        }

        [HttpPost]
        public HttpResponseMessage SaveQuestionAnswer(SaveStressManageQuestionAnswer Data)
        {
            try
            {

                int result;
                int TotalScore = 0;

                XElement rootNode = new XElement("DocumentElement");
                for (int i = 0; i < Data.QuestionAnswerList.Count(); i++)
                {
                    XElement QuestionAnswer = new XElement("StressManagement",
                       new XElement("QuestionID", Data.QuestionAnswerList[i].QuestionID),
                       new XElement("AnswerID", Data.QuestionAnswerList[i].AnswerID),
                       new XElement("TotalPoints", Data.QuestionAnswerList[i].AnswerPoints)
                       );
                    rootNode.Add(QuestionAnswer);

                    TotalScore += Data.QuestionAnswerList[i].AnswerPoints;
                }

                string xmlString = Convert.ToString(rootNode);
                xmlString = xmlString.ToString().Replace("+05:30", "");

                result = _premiumDashboardRepository.SaveStressQuestionAnswers(xmlString.ToString().Replace("T00:00:00+05:30", ""), Data.MemberId, DateTime.Now);

                if (result > 0)
                {
                    ReturnSaveStressManageQuestionAnswer obj = new ReturnSaveStressManageQuestionAnswer();

                    if (TotalScore >= 0 && TotalScore <= 40)
                    {
                        obj.MessageTitle = "Low Stress";
                        obj.MessageDescription = "Stay connected to continue to manage stress effectively : Your scores presently fall in the low risk of experiencing health consequences as you seem to be managing stress effectively. To enhance and update your knowledge on effective stress management stay connected to this platform.";
                    }
                    else if (TotalScore >= 41 && TotalScore <= 80)
                    {
                        obj.MessageTitle = "Moderate Stress";
                        obj.MessageDescription = "Can Manage Stress better with Professional Support: Your scores presently fall in the moderate risk of experiencing health consequences due to your stress levels.  While you may not be experiencing  serious health consequences as yet, it's important to lead a healthy lifestyle that includes minimal stress as stress over time can lead to more serious problems. To manage stress better and optimize your health contact your Wellness Expert now.";
                    }
                    else
                    {
                        obj.MessageTitle = "High Stress";
                        obj.MessageDescription = "Immediate Help Required! Your scores presently fall in the high risk of experiencing health consequences due to your stress levels. It's important to manage stress in your lifestyle to safeguard  and your health, or prevent further damage. To get further assistance and to learn how to manage stress contact your stress counselor now.";
                    }
                    obj.Id = result;
                    obj.TotalScore = TotalScore;

                    return Request.CreateResponse(HttpStatusCode.OK, new { status = 0, Data = obj });
                }
                else
                    return Request.CreateResponse(HttpStatusCode.OK, new { status = 0, Data = new { } });

            }
            catch (Exception ex)
            {
                CommonFunctions.WriteError(ex.StackTrace, "PremiumDashboard", "SaveQuestionAnswer");
                return Request.CreateResponse(HttpStatusCode.OK, CommonFunctions.ReturnError());
            }
        }

        #region member goal habits

        /// <summary>
        /// Manoj Kumawat - 19-Sep-2017
        /// </summary>
        /// <param name="model"></param>
        /// <returns> list of membergoal habits</returns>
        [HttpPost]
        public HttpResponseMessage GetMemberGoalHabit(CommonModel model)
        {
            if (model.MemberID > 0)
            {
                //gets member goal habits along with selected ones.
                var result = _premiumDashboardRepository.GetMemberGoalHabit(model.MemberID);

                return Request.CreateResponse(HttpStatusCode.OK, new { status = 0, Data = result });
            }
            return Request.CreateResponse(HttpStatusCode.OK, new { status = -1, Data = new { } });
        }
        /// <summary>
        /// Manoj Kumawat - 19-Sep-2017
        /// </summary>
        /// <param name="model"></param>
        /// <returns> list of member habit reminders</returns>
        [HttpPost]
        public HttpResponseMessage GetHabitReminder(CommonModel model)
        {
           
                try
                {
                    List<int> habitIDs= _context.Member_Habit.Where(t=>t.MemberID==model.MemberID).Select(t=>t.HabitID??0).ToList();

                    var memberReminder=_context.Member_HabitReminder.ToList().Where(t => t.MemberID == model.MemberID && habitIDs.Contains(t.HabitID.Value));

                    var defaultReminder = _context.HabitReminders.ToList().Where(t => habitIDs.Contains(t.HabitID.Value) && t.IsActive == true
                        && !memberReminder.Select(m=>m.HabitID).Contains(t.HabitID));

                    List<MemberHabitReminderModel> tblMemberHabitReminderModel = new List<MemberHabitReminderModel>();
                    foreach (string _ReminderName in memberReminder.Select(t=>t.ReminderName).Distinct())
                    {

                        // We will show all the member reminder and memver can choose time for any reminder if it's not in detail reminder
                        //if (!_context.HabitReminders.Any(t => t.ReminderName == _ReminderName))
                        //    continue;


                        if (memberReminder.Any(t => t.ReminderName == _ReminderName))
                        {

                            MemberHabitReminderModel tbl = new MemberHabitReminderModel();
                            tbl.HabitID = _context.HabitReminders.Where(t => t.ReminderName == _ReminderName).Select(t => t.HabitID).FirstOrDefault();
                            tbl.ReminderName = _ReminderName;// _context.HabitReminders.Where(t => t.HabitID == _habitID).Select(t => t.ReminderName).FirstOrDefault();
                            tbl.ReminderText = _context.HabitReminders.Where(t => t.ReminderName == _ReminderName).Select(t => t.ReminderText).FirstOrDefault();
                            tbl.HabitReminder = memberReminder.Where(a=>a.ReminderName==_ReminderName).ToList().Select(x => new HabitReminderData
                            {

                                ReminderName = x.ReminderName,
                                ReminderText = x.ReminderText,
                                Time = DateTime.ParseExact(x.ReminderTime.ToString(), "HH:mm:ss", CultureInfo.InvariantCulture).ToString("hh:mm tt"),
                                IsDisabled = (x.IsActive ?? true) ? false : true,
                                LastUpdated = x.LastUpdatedOn.Value
                            }).ToList();

                            tblMemberHabitReminderModel.Add(tbl);

                            //foreach (var item in memberReminder.Where(t => t.HabitID == _habitID).ToList())
                            //{
                            //    MemberHabitReminderModel tbl = new MemberHabitReminderModel();
                            //    tbl.HabitID = _habitID;
                            //    tbl.ReminderName = item.ReminderName;
                            //    tbl.ReminderText = !string.IsNullOrWhiteSpace(item.ReminderText) ? item.ReminderText : item.ReminderName;
                            //    tbl.HabitReminder = item.ReminderTime.ToString().Split(',').ToList().Select(x => new HabitReminderData
                            //    {

                            //        ReminderName = item.ReminderName,
                            //        ReminderText = item.ReminderText,
                            //        Time = DateTime.ParseExact(x, "HH:mm:ss", CultureInfo.InvariantCulture).ToString("hh:mm tt"),                                 
                            //        IsDisabled = false,
                            //        LastUpdated = item.LastUpdatedOn.Value
                            //    }).ToList();

                            //    tblMemberHabitReminderModel.Add(tbl);
                            //}

                            //MemberHabitReminderModel tbl = new MemberHabitReminderModel();
                            //tbl.HabitID = _habitID;
                            //tbl.ReminderName = _context.HabitReminders.Where(t => t.HabitID == _habitID).Select(t => t.ReminderName).FirstOrDefault();
                            //tbl.ReminderText = _context.HabitReminders.Where(t => t.HabitID == _habitID).Select(t => t.ReminderText).FirstOrDefault();
                            //tbl.ReminderText = !string.IsNullOrWhiteSpace(tbl.ReminderText) ? tbl.ReminderText : tbl.ReminderName;
                            //tbl.HabitReminder = memberReminder.Where(t => t.HabitID == _habitID).Select(x => new HabitReminderData
                            //{

                            //    ReminderName = x.ReminderName,
                            //    ReminderText = x.ReminderText,
                            //    Time = DateTime.ParseExact(x.ReminderTime.ToString(), "HH:mm:ss", CultureInfo.InvariantCulture).ToString("hh:mm tt"),
                            //    IsDisabled = (x.IsActive ?? true) ? false : true,
                            //    LastUpdated = x.LastUpdatedOn.Value
                            //}).ToList();

                            //tblMemberHabitReminderModel.Add(tbl);
                        }
                     
                    }




                    foreach (var item in defaultReminder)
                    {
                        MemberHabitReminderModel tbl = new MemberHabitReminderModel();
                        tbl.HabitID = item.HabitID;
                        tbl.ReminderName = item.ReminderName;
                        tbl.ReminderText = !string.IsNullOrWhiteSpace(item.ReminderText) ? item.ReminderText : item.ReminderName;
                        tbl.HabitReminder = item.ReminderTime.Split(',').ToList().Select(x => new HabitReminderData
                        {

                            ReminderName = item.ReminderName,
                            ReminderText = item.ReminderText,
                            Time = x,
                            IsDisabled = false,
                            LastUpdated = item.LastUpdatedOn.Value
                        }).ToList();

                        tblMemberHabitReminderModel.Add(tbl);
                    }

                  

                    ////gets member habit reminders defaults along with already saved reminders.
                    //var result = _premiumDashboardRepository.GetMemberHabitReminders(model.MemberID);
                    return Request.CreateResponse(HttpStatusCode.OK, new { status = 0, Data = tblMemberHabitReminderModel });
                }
                catch (Exception ex)
                {
                    CommonFunctions.WriteError(ex.Message, "premium", "HabitReminder");
                }
           
            return Request.CreateResponse(HttpStatusCode.OK, new { status = -1, Data = new { } });
        }
        /// <summary>
        /// Manoj Kumawat - 19-Sep-2017
        /// </summary>
        /// <param name="model"></param>
        /// <param name="MemberId"></param>
        /// <returns> save member habit reminders</returns>
        [HttpPost]
        public HttpResponseMessage SaveMemberHabitReminder(SaveHabitReminderModel data)
        {

            try
            {
                DateTime? _lastUpdateDate=DateTime.Now;
                var json = new System.Web.Script.Serialization.JavaScriptSerializer().Serialize(data.Data);
                var model = data.Data;

                if (model != null)
                {
                
                    model.ForEach(c =>
                    {
                        if (c.Times != null)
                        {
                            bool IsDelete = (c.Times.Count == c.Times.Count(x => x.IsRemoved == 1) ? false : true); // if all time have IsRemoved=1 it mean member want to disable else remove some times (Arvind 21-Setp-2017)

                         

                            c.Times.ToList().ForEach(t =>
                            {
                                CommonFunctions.WriteError(t.Time.ToString(), "inner loop", "SaveMemberHabitReminder");

                                if (!string.IsNullOrEmpty(t.Time))
                                {
                                    var habitModel = new HabitReminderModel
                                    {
                                        HabitID = c.HabitID,
                                        MemberId = c.MemberId,
                                        ReminderName = c.ReminderName,
                                        ReminderText = c.ReminderText,
                                        ReminderTime = t.Time,
                                        IsRemoved = t.IsRemoved
                                    };
                                    string xml = CommonFunctions.GetXMLFromObject(habitModel);
                                    if (IsDelete && t.IsRemoved == 1)
                                        _premiumDashboardRepository.DeleteMemberHabitReminder(c.MemberId, c.HabitID, t.Time);
                                    else
                                    {
                                        int result = _premiumDashboardRepository.SaveMemberHabitReminder(xml);
                                    }
                                }
                            });
                        }
                    });

                    var tbl = _context.Member_HabitReminder.OrderByDescending(t => t.LastUpdatedOn).FirstOrDefault();
                    if (tbl != null)
                        _lastUpdateDate = tbl.LastUpdatedOn;
                    
                    return Request.CreateResponse(HttpStatusCode.OK, new
                    {
                        status = 0,
                        Data = new
                        {
                            LastUpdateDate = _lastUpdateDate.Value.AddMilliseconds(-_lastUpdateDate.Value.Millisecond)
                        }
                    });
                }
                return Request.CreateResponse(HttpStatusCode.OK, new { status = 1, Data = new {LastUpdateDate = DateTime.Now} });
            }
            catch (Exception ex)
            {
                CommonFunctions.WriteError(ex.Message + ", Detail: " + ex.InnerException, "premium", "SaveMemberHabitReminder");
            }

            return Request.CreateResponse(HttpStatusCode.OK, new { status = -1, Data = new { } });
        }
        /// <summary>
        /// Manoj Kumawat 19-Sep-2017
        /// </summary>
        /// <param name="habitIDs"></param>
        /// <param name="MemberId"></param>
        /// <returns></returns>
        [HttpPost]
        public HttpResponseMessage SaveMemberHabit(HabitModel model)
        {
            if (model.MemberID > 0)
            {
                try
                {
                    // Delete all member Habit from the table in Habit Ids provided
                    if (string.IsNullOrWhiteSpace(model.habitIDs))
                    {
                        _premiumDashboardRepository.DeleteMemberGoalHabit(model.MemberID);
                    }
                    else
                    {
                        _premiumDashboardRepository.DeleteMemberGoalHabit(model.MemberID);

                        model.habitIDs.Split(',').ToList().ForEach(c =>
                        {
                            if (!string.IsNullOrWhiteSpace(c))
                                _premiumDashboardRepository.SaveMemberGoalHabit(model.MemberID, Convert.ToInt32(c));
                        });
                    }
                    return Request.CreateResponse(HttpStatusCode.OK, new { status = 0, Data = new { } });
                }
                catch (Exception ex)
                {
                    CommonFunctions.WriteError(ex.Message, "premium", "SaveMemberHabit");
                }
            }
            return Request.CreateResponse(HttpStatusCode.OK, new { status = -1, Data = new { } });
        }
        [HttpPost]
        public HttpResponseMessage GetMemberHabitWeeklyStatus(PremiumDashboardModel model)
        {
            try
            {
                if (model.MemberID > 0)
                {
                    List<GetMemberHabitWeeklyStatus_TodayProgress_Result> todayProgressList = new List<GetMemberHabitWeeklyStatus_TodayProgress_Result>();
                    List<GetMemberHabitWeeklyStatus_WeeklyProgress_Result> weeklyProgressList = new List<GetMemberHabitWeeklyStatus_WeeklyProgress_Result>();

                    MemberWeeklyHabitModel objModel = new MemberWeeklyHabitModel();
                    _premiumDashboardRepository.GetMemberHabitWeeklyStatus(model.MemberID, out todayProgressList, out weeklyProgressList);

                    objModel.TodayProgressList = todayProgressList;
                    objModel.WeeklyProgressList = weeklyProgressList;

                    List<MemberHabitProgressModel> habitModel = new List<MemberHabitProgressModel>();

                    foreach (var item in objModel.TodayProgressList)
                    {
                        MemberHabitProgressModel progressModel = new MemberHabitProgressModel();
                        progressModel.HabitID = item.HabitID;
                        progressModel.IsTrackerBasedHabit = item.IsTrackerBasedHabit;
                        progressModel.ProgressPercentage = item.ProgressPercentage;
                        progressModel.Title = item.Title;
                        progressModel.TrackerID = item.TrackerID;
                        progressModel.ImagePath = System.Configuration.ConfigurationManager.AppSettings["HabitImagePath"] + item.HabitID + ".png" ;
                        progressModel.WeeklyProgressList = objModel.WeeklyProgressList.Where(x => x.HabitID == item.HabitID && x.TrackerID == item.TrackerID).ToList();
                        habitModel.Add(progressModel);
                    }

                    return Request.CreateResponse(HttpStatusCode.OK, new { status = 0, Data = habitModel });
                }
                else
                {
                    return Request.CreateResponse(HttpStatusCode.OK, new { status = -1, Data = new { } });

                }
            }
            catch (Exception ex)
            {
                CommonFunctions.WriteError(ex.StackTrace, "PremiumDashboard", "GetMemberHabitWeeklyStatus");
                return Request.CreateResponse(HttpStatusCode.OK, new { status = -1, Data = new { } });
            }
        }

        [HttpPost]
        public HttpResponseMessage SaveMemberHabitValue(CommonModel model)
        {
            if (model.MemberID > 0)
            {
                try
                {
                    if (model.HabitID > 0)
                    {
                        _premiumDashboardRepository.SaveMemberHabitValue(model.MemberID, model.HabitID, model.value);
                        return Request.CreateResponse(HttpStatusCode.OK, new { status = 0 });
                    }                    
                }
                catch (Exception ex)
                {
                    CommonFunctions.WriteError(ex.Message, "PremiumDashboard", "SaveMemberHabitValue");
                }
            }
            return Request.CreateResponse(HttpStatusCode.OK, new { status = -1 });
        } 

        #endregion
    }
}
