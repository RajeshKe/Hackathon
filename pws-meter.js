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
                 
        .custom_msg { 
            font-size:12px; 
            text-indent:4px;
            color:#666666;
            min-height:10px;
            font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
        }
        .info_icon { 
            float:right; 
            color:#ffa64d; 
            font-size:12px; 
            font-style:italic;
            text-decoration:underline;
            margin-right10px;
            cursor:pointer;
        }
        .indicator_outer_div { margin-top:16px; width:100%; display:none; }
        .advanceindicator { 
            font-size:12px; 
            color:red; 
            min-height:20px; 
            display:none; 
            margin-top:5px;
            text-indent:4px;
            font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
        }
        .passwordstatusborder {
            box-sizing: border-box;
            height: 2px;
            position: relative;
            top: 1px;
            right: 1px;
            transition: width 300ms ease-out;
            background-color:red;
        }
        .PasswordStrength {
            border: 1px solid #c6c6c6;
            box-sizing: border-box;
            color: #090809;
            font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
            font-size: 18px;
            line-height: 1;
            position: relative;
        }
        .PasswordStrength-input {
            border: none;
            box-sizing: border-box;
            font-size: 18px;
            padding: 14px 0 12px 14px;
            width: calc(80% - 28px);
        }
        .PasswordStrength-strength-bar {
            box-sizing: border-box;
            height: 2px;
            position: relative;
            top: 1px;
            right: 1px;
            transition: width 300ms ease-out;
            width: 0;
            display:none;
        }
        .PasswordStrength-strength-desc {
            color: transparent;
            font-style: italic;
            padding: 14px 12px;
            position: absolute;
            top: 1px;
            right: 0;
            text-align: right;
            transition: color 250ms ease-in-out;
            width: 20%;
            font-size:16px;
        }
      </style>
      

      <div class="PasswordStrength">
        <input type="password" placeholder$="{{inputplaceholder}}" class="PasswordStrength-input" id="inputPassword" value="" on-keyup="_dynamicPassword">
        <div class="PasswordStrength-strength-bar" style$="{{strengthborder}}"></div>
        <span class="PasswordStrength-strength-desc" style$="{{showindicator}}">[[dynamicstatus]]</span>
      </div>

      <div class="indicator_outer_div" style$="{{showindicator}}">
          <div class="custom_msg">[[dynamicmsg]] 
            <span class="info_icon" title$="{{iconmessage}}" style$="{{showinfo}}">Password hint</span>
          </div>
          <div class="advanceindicator" style$="{{showadvanceerror}}">
                [[advancerrormsg]]
          </div>
      </div>`;
    }
    
  static get properties() {
      return {
          
          customsg:       { type:String, value:'' },
          inputplaceholder: { type:String, value:''},
          username:       { type:String, value:'' },
          dynamicmsg:     { type:String, value:'' },
          dynamicstatus:   { type:String, value:'' },
          strengthrange:  { type:String, value:'' },
          infoicon:       { type:String, value:'' }, 
          iconmessage:    { type:String, value:'' },
          showinfo :      { type:String, value:'' },
          showindicator:  { type:String, value:'' },
          advancerrormsg: { type:String, value:'' },
          showadvanceerror: { type:String, value:'' },
          strengthborder: { type:String, value:''},
          statuswords: { type:String,value:['Short','Weak','Okay','Good','Strong']},
          statuscolors: { type:Object, value:['#D1462F','#D1462F','#57B8FF','#57B8FF','#2FBF71']} 


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

    checkusernameexistfun (username,password){
        return password.match(/[a-z]+/ig).filter(a=> a.length > 4 && username.includes(a)).length > 0? true:false;
    }

    checkcurrentyearexistfun(password){
        var year = new Date().getFullYear();
       // return password.match(year).filter(a=> a.length > 4 && username.includes(a)).length > 0? true:false;
        return false;
    }

    showindicators(message,statustxt,indicator,indicatorborder) {
        this.showindicator = "display:block;";  
        this.strengthborder = "display:block;"
        this.dynamicmsg = message;
        this.dynamicstatus = statustxt;
        this.showindicator += indicator;
        this.strengthborder += indicatorborder;
    }

  _dynamicPassword(event) {  console.log("array values===="+this.statuswords)
      var password = event.target.value;
    if(password!='' && password!='undefined' && password.length>0) { 
        
        let finalscore = this.checkPasswordFun(password);

        if (finalscore > 80 && password!='') {
              //password strong section here.
              this.showindicators("Your Password is "+this.statuswords[4],this.statuswords[4],"color:"+this.statuscolors[4],"width:98%;background:"+this.statuscolors[4]);
        }else if (finalscore > 60 && password!='') {
            //password good section here.
             this.showindicators("Your Password is "+this.statuswords[3],this.statuswords[3],"color:"+this.statuscolors[3],"width:80%;background:"+this.statuscolors[3]);
        } else if(finalscore > 45 && password!=''){
            //password fair section here.
              this.showindicators("Your Password is "+this.statuswords[2],this.statuswords[2],"color:"+this.statuscolors[2],"width:60%;background:"+this.statuscolors[2]);
        } else if (finalscore >= 30 && password!='') {
            //password weak section here.
            this.showindicators("Your Password is "+this.statuswords[1],this.statuswords[1],"color:"+this.statuscolors[1],"width:40%;background:"+this.statuscolors[1]);
        } else {
            //password to short section here.
             this.showindicators("Your Password is Too "+this.statuswords[0],this.statuswords[0],"color:"+this.statuscolors[0],"width:20%;background:"+this.statuscolors[0]);
        }

        if(this.customsg!='' && this.customsg.length>0 && this.customsg!='undefined') {
            this.dynamicmsg = this.customsg;
        } 

        if(this.infoicon=='enable') { this.showinfo = "display:block;" } else { this.showinfo = "display:none;" }

        if(this.iconmessage=='' || this.iconmessage=='undefined') { this.iconmessage = "Dynamic icon message comes here"; }

        if(this.strengthrange!='' && this.strengthrange=='advanced' && this.username!='' && this.username!='undefined') {
            this.advancerrormsg     ="";
            if(this.checkusernameexistfun(this.username, password)) {
               
                this.advancerrormsg     += "* Your password should not contain the username";
            } if(this.checkcurrentyearexistfun(password)) {
                this.advancerrormsg     += "* your password should not contain current year";

            } 
            
            if(this.advancerrormsg!='') {
                this.showadvanceerror   = "display:block";
            } else {
                this.showadvanceerror   = "display:none";
            }
        } else {
            this.showadvanceerror   = "display:none";
            this.advancerrormsg     = "";
        }
        
    } else {
        this.showindicator = "display:none;";
        this.strengthborder = "display:none;"
    }
            
  }
 
}

window.customElements.define('pws-meter', PwsMeter);
