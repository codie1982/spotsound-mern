const asyncHandler = require("express-async-handler");
const SupportModel = require("../models/supportModel");
const userDb = require("../controller/users/usersDb")
const supportDb = require("../controller/support/supportDb")
const preparedata = require("../config/preparedata")
const saveMail = require("../mail/maildb")
const mail = require("../mail/mailController");
const verifyRecaptcha = require("../controller/rechaptca/rechaptca")
const { default: mongoose } = require("mongoose");
const getSupports = asyncHandler(async (req, res) => {

  const userid = req.user._id;
  try {
    //get support count
    var supports = await supportDb.getSupportsbyUser(userid)
    if (supports) {
      res.status(200)
        .json(preparedata(supports, 200, "users supports"))
    } else {
      res.status(400)
        .json(preparedata(null, 400, "not supports"))
    }
  } catch (error) {
    res.status(500)
      .json(preparedata(error, 500, "Error reading data"))
  }
});
//access private
const addsupport = asyncHandler(async (req, res) => {
  const userid = req.user._id
  const { recaptchaToken, subject, description } = req.body;
  console.log("userid,subject,description", userid, subject, description);
  try {
    const verificationResponse = await verifyRecaptcha(recaptchaToken);
    if (verificationResponse.success && verificationResponse.action === 'submit_form' && verificationResponse.score >= 0.5) {
      var userData = await userDb.getUserInfo(userid)
      console.log("userData", userData);
      //get support count
      var supportCount = await supportDb.getSupportCountbyUser(userid)
      console.log("supportCount", supportCount);

      if (supportCount < 25) {
        const supportDoc = new SupportModel()
        supportDoc.userId = mongoose.Types.ObjectId(userData._id);
        supportDoc.subject = subject;
        supportDoc.description = description;
        const nSupport = await supportDoc.save();
        if (nSupport) {
          saveMail(process.env.MAIL_ADRESS, userData.email, subject, description, {})
            .then((result) => {
              //console.log('Mesaj Kayıt edildi: %s', info.messageId);
              console.log('Mesaj Kayıt edildi: %s', result);
            }).catch((err) => {
              console.log('Mesaj Kayıt edilemedi: %s', err);
            })
          await mail.supportMail(userData, `${subject} konusu ile ilgli destek talebi`, "Destek talebiniz kayıt altına alınmıştır. Sizinle en kısa zamanda iletişim kurulacaktır. İyi günler dileriz")
          res.status(400)
            .json(preparedata({}, 200, "Talep kayıt edildi"))
        } else {
          res.status(400)
            .json(preparedata(data, 400, "supprt not save"))
        }
      } else {
        res.status(400)
          .json(preparedata(data, 400, "max support limit 5"))
      }
    } else {
      console.log("verificationResponse", verificationResponse)
      res.status(400)
        .json(preparedata(verificationResponse, 400, "reCaptha error"))
    }



  } catch (error) {
    res.status(500)
      .json(preparedata(error, 500, "Error reading data"))
  }

});
const updateSolve = asyncHandler(async (req, res) => {
  const { supportId, solve } = req.body;
  try {
    //get support count
    var support = await supportDb.getSupportDetail(supportId)
    if (support && support.active) {
      var supports = await supportDb.updateSupportSolved(supportId, solve)
      if (supports) {
        res.status(200)
          .json(preparedata(supports.solved, 200, "support solve update"))
      } else {
        res.status(400)
          .json(preparedata(null, 400, "support solve not update"))
      }
    } else {
      res.status(400)
        .json(preparedata(null, 400, "support not active"))
    }

  } catch (error) {
    res.status(500)
      .json(preparedata(error, 500, "Error reading data"))
  }
});

const deleteSupport = asyncHandler(async (req, res) => {
  const { supportId } = req.body;
  try {
    //get support count
    var supports = await supportDb.deleteSupport(supportId)
    if (supports) {
      res.status(200)
        .json(preparedata({}, 200, "delete supports"))
    } else {
      res.status(400)
        .json(preparedata(null, 400, "not delete supports"))
    }
  } catch (error) {
    res.status(500)
      .json(preparedata(error, 500, "Error reading data"))
  }
});
const forceDeleteSupport = asyncHandler(async (req, res) => {
  const { supportId } = req.body;
  try {
    //get support count
    var supports = await supportDb.forceDeleteSupport(supportId)
    if (supports) {
      res.status(200)
        .json(preparedata({}, 200, "force delete is succesful"))
    } else {
      res.status(400)
        .json(preparedata(null, 400, "not supports"))
    }
  } catch (error) {
    res.status(500)
      .json(preparedata(error, 500, "Error reading data"))
  }
});

module.exports = {
  addsupport, getSupports, updateSolve, deleteSupport, forceDeleteSupport
};
