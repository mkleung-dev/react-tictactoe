(this.webpackJsonptictactoe=this.webpackJsonptictactoe||[]).push([[0],{14:function(e,t,r){},8:function(e,t,r){e.exports=r(9)},9:function(e,t,r){"use strict";r.r(t);var a=r(3),n=r(1),s=r(2),u=r(5),i=r(4),l=r(0),o=r.n(l),c=r(7),h=r.n(c);r(14);function f(e){return o.a.createElement("button",{className:e.format,onClick:e.onClick},e.value)}var m=function(e){Object(u.a)(r,e);var t=Object(i.a)(r);function r(){return Object(n.a)(this,r),t.apply(this,arguments)}return Object(s.a)(r,[{key:"renderSquare",value:function(e){var t=this;return o.a.createElement(f,{value:this.props.squares[e],format:this.props.formats[e],onClick:function(){return t.props.onClick(e)}})}},{key:"render",value:function(){for(var e=[],t=0;t<3;t++){for(var r=[],a=0;a<3;a++)r.push(this.renderSquare(3*t+a));e.push(o.a.createElement("div",{className:"board-row"},r))}return o.a.createElement("div",null,e)}}]),r}(o.a.Component),v=function(e){Object(u.a)(r,e);var t=Object(i.a)(r);function r(e){var a;return Object(n.a)(this,r),(a=t.call(this,e)).state={history:[{squares:Array(9).fill(null)}],formats:Array(9).fill("square"),stepNumber:0,xIsNext:!1},setInterval((function(){if(!a.state.xIsNext){var e=function e(t,r,a){var n="X"===r?"0":"X",s=p(a);if(s===t)return[[1,-1]];if(d(a))return[[0,-1]];if(null!==s)return[[-1,-1]];var u=[];if(t===r)for(var i=-99999,l=0;l<a.length;l++){if(null===a[l])(c=a.slice())[l]=r,(h=e(t,n,c))[0][0]>i?(u=[],i=h[0][0],u.push([i,l])):h[0][0]===i&&u.push([i,l])}else{var o=99999;for(l=0;l<a.length;l++){var c,h;if(null===a[l])(c=a.slice())[l]=r,(h=e(t,n,c))[0][0]<o?(u=[],o=h[0][0],u.push([o,l])):h[0][0]===o&&u.push([o,l])}}return u}("0","0",a.state.history[a.state.stepNumber].squares),t=Math.floor(Math.random()*e.length);a.handleClick(e[t][1])}}),100),a}return Object(s.a)(r,[{key:"handleManualClick",value:function(e){this.state.xIsNext&&this.handleClick(e)}},{key:"handleClick",value:function(e){var t=this.state.history.slice(0,this.state.stepNumber+1),r=t[t.length-1].squares.slice();p(r)||r[e]||(r[e]=this.state.xIsNext?"X":"0",this.setState({history:t.concat([{squares:r,motion:e}]),formats:q(r),stepNumber:t.length,xIsNext:!this.state.xIsNext}))}},{key:"jumpTo",value:function(e){this.setState({formats:q(this.state.history[e].squares),stepNumber:e,xIsNext:e%2===0})}},{key:"render",value:function(){var e,t=this,r=this.state.formats,a=this.state.history,n=a[this.state.stepNumber],s=p(n.squares),u=a.map((function(e,r){var n=r===t.state.stepNumber?"currStep":"nonCurrStep",s=r?"Go to move #"+r+" ("+a[r].motion%3+","+parseInt(a[r].motion/3,10)+")":"Go to game start";return o.a.createElement("li",{key:r},o.a.createElement("button",{className:n,onClick:function(){return t.jumpTo(r)}},s))})),i=[];return i.push(o.a.createElement("ol",null,u)),e=s?"Winner: "+s:d(n.squares)?"Draw":"Next player: "+(this.state.xIsNext?"X":"O"),o.a.createElement("div",{className:"game"},o.a.createElement("div",{className:"game-board"},o.a.createElement(m,{squares:n.squares,formats:r,onClick:function(e){return t.handleManualClick(e)}})),o.a.createElement("div",{className:"game-info"},o.a.createElement("div",null,e),i))}}]),r}(o.a.Component);function p(e){for(var t=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]],r=0;r<t.length;r++){var n=Object(a.a)(t[r],3),s=n[0],u=n[1],i=n[2];if(e[s]&&e[s]===e[u]&&e[s]===e[i])return e[s]}return null}function q(e){for(var t=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]],r=["square","square","square","square","square","square","square","square","square"],n=0;n<t.length;n++){var s=Object(a.a)(t[n],3),u=s[0],i=s[1],l=s[2];e[u]&&e[u]===e[i]&&e[u]===e[l]&&(r[u]="squareHighlighted",r[i]="squareHighlighted",r[l]="squareHighlighted")}return r}function d(e){for(var t=0;t<e.length;t++)if(null==e[t])return!1;return!0}h.a.render(o.a.createElement(v,null),document.getElementById("root"))}},[[8,1,2]]]);
//# sourceMappingURL=main.3d60bc22.chunk.js.map