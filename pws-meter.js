import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';

/**
 * `pws-meter`
 * Password strength meter
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class PwsMeter extends PolymerElement {
    static get template() {
      return html`   
      <style>
          .score1 { background-color:gray; width:10%; height:100%; }
          .score2 { background-color:red;  width:25%; height:100%; }
          .score3 { background-color:yellow; width:50%; height:100%; }
          .score4 { background-color:blue; width:75%; height:100%; }
          .score5 { background-color:green; width:95%; height:100%; }
          .meterouterdiv { width:100%; margin-top:8px; height:10px; background-color:#ddd;box-shadow:2px 2px 2px #ddd; }
          .custom_msg { 
            font-size:12px; 
            text-indent:4px;
            color:#666666;
            min-height:10px;
            font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
        }
          .info_icon { float:right; color:#ffa64d; font-size:12px; font-style:italic; text-decoration:underline; margin-right10px; cursor:pointer; }
          .indicator_outer_div { margin-top:10px;width:100%; }
          .advanceindicator { font-size:12px; color:red; min-height:20px;text-indent:4px; display:none; margin-top:8px; font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; }
      </style>
      <div class="indicator_outer_div" style$="{{showindicator}}">
          <div class="custom_msg">[[dynamicmsg]]
          <span class="info_icon" title$="{{iconmessage}}" style$="{{showinfo}}">Password hint</span>
          </div>
          <div class="meterouterdiv">
              <div class$="{{indicatorcolor}}" style$="{{dynamic_color}}"></div>
          </div>
          <div class="advanceindicator" style$="{{showadvanceerror}}">
                [[advancerrormsg]]
          </div>
      </div>`;
    }
        
  static get properties() {
      return {

          mypassword:       { type:String, value:'' },
          customsg:         { type:String, value:'', /*observer:'_CustomText'*/ },
          passwordscore:    { type:Number, value:'' },
          username:         { type:String, value:'' },
          msgcolor:         { type:String, value:'' },
          dynamicmsg:       { type:String, value:'' },
          indicatorcolor:   { type:String, value:'' },
          strengthrange:    { type:String, value:'' },
          infoicon:         { type:String, value:'' }, 
          iconmessage:      { type:String, value:'' },
          showinfo :        { type:String, value:'' },
          showindicator:    { type:String, value:'' },
          advancerrormsg:   { type:String, value:'' },
          showadvanceerror: { type:String, value:'' },
          rangewords:       { type:String,value:"Short,Weak,Okay,Good,Strong"},
          rangecolors:      { type:String, value:"#D1462F,#D1462F,#57B8FF,#57B8FF,#2FBF71"},
          dynamic_color:    { type:String, value:'' } 

      }
  }

  static get observers() {
    return [
      // Observer method name, followed by a list of dependencies, in parenthesis
      '_dynamicPassword(mypassword, filter)'
    ]
  }

  checkPasswordFun(pass) {  
    
      let score = 0;
      if (!pass) {
          return score;
      }

      // award every unique letter until 5 repetitions
      let letters = new Object();
      for (var i=0; i<pass.length; i++) {
          letters[pass[i]] = (letters[pass[i]] || 0) + 1;
          score += 5.0 / letters[pass[i]];
      }

      // bonus points for mixing it up
      let variations = {
          digits: /\d/.test(pass),
          lower: /[a-z]/.test(pass),
          upper: /[A-Z]/.test(pass),
          nonWords: /\W/.test(pass),
      }

      let variationCount = 0;
      for (var check in variations) {
          variationCount += (variations[check] == true) ? 1 : 0;
      }
      score += (variationCount - 1) * 10;

      return parseInt(score);
      
  }
  
    showindicators(passwordscore,dynamicmsg,dynamic_color) {
        
        this.showindicator = "display:block;";  

        this.passwordscore  = passwordscore;
        this.dynamicmsg     = dynamicmsg;
        this.dynamic_color  = dynamic_color;

        this.indicatorcolor = "score"+this.passwordscore;
    }

    checkusernameexistfun (username,password){
        return password.match(/[a-z]+/ig).filter(a=> a.length > 4 && username.includes(a)).length > 0? true:false;
    }

    checkcurrentyearexistfun(password){
        var year = new Date().getFullYear();
        return  password.includes(year);
    }

    getcurrentdomainname(password) {
        var domain_name = window.location.hostname;
        return  password.includes(domain_name);
    }

  _dynamicPassword(password) { 
      
    var statuswords  = this.rangewords.split(',');
    var statuscolors = this.rangecolors.split(',');

    if(password!='' && password!='undefined' && password.length>0) { 
         
        let finalscore = this.checkPasswordFun(password);

        if(this.strengthrange!='' && this.strengthrange=='advanced' && this.username!='' && this.username!='undefined') {
            
            this.advancerrormsg = "";
            if(this.checkusernameexistfun(this.username, password)) {
                this.advancerrormsg += "Your password should not contain the username";
            } else if(this.checkcurrentyearexistfun(password)) {
                this.advancerrormsg += "Your password should not contain current year datas";
            } else if(this.getcurrentdomainname(password)) {
                this.advancerrormsg += "Your password should not contain the domain name";
            }
            
            if(this.advancerrormsg!='') {
                this.showadvanceerror   = "display:block";
                finalscore = 45;
            }else {
                this.showadvanceerror   = "display:none";
            }
        } else {
            this.showadvanceerror   = "display:none";
            this.advancerrormsg     = "";
        }


        if (finalscore > 80 && password!='') {
              //password strong section here.
              this.showindicators(5,"Your Password is "+statuswords[4],"background:"+statuscolors[4]);
        }else if (finalscore > 60 && password!='') {
            //password good section here.
            this.showindicators(4,"Your Password is "+statuswords[3],"background:"+statuscolors[3]);
        } else if(finalscore > 45 && password!=''){
            //password fair section here.
            this.showindicators(3,"Your Password is "+statuswords[2],"background:"+statuscolors[2]);
        } else if (finalscore >= 30 && password!='') {
            //password weak section here.
            this.showindicators(2,"Your Password is "+statuswords[1],"background:"+statuscolors[1]);
        } else {
            //password to short section here.
            this.showindicators(1,"Your Password is "+statuswords[0],"background:"+statuscolors[0]);
        }
        

        if(this.customsg!='' && this.customsg.length>0 && this.customsg!='undefined') {
            this.dynamicmsg = this.customsg;
        } 

        if(this.infoicon=='enable') { this.showinfo = "display:block;" } else { this.showinfo = "display:none;" }

        if(this.iconmessage=='' || this.iconmessage=='undefined') { this.iconmessage = "Dynamic icon message comes here"; }
            
    } else {
        this.showindicator = "display:none";
    }
            
  }

}

window.customElements.define('pws-meter', PwsMeter);
