/*
*   -Bscomponent //生html TAG 給 JQ用 testing
		

*/

class NicoSpan extends React.Component{
	render(){
		return (
			<span>
				<span id="menuIcon" className="glyphicon glyphicon-menu-hamburger" ></span>
				<span id="pageName" >Nico Nico</span>
			</span>
		)
	}
}

class DivFormGroup extends React.Component{
	render(){
		return (
			<div id="fromDiv" className="col-sm-6">
				<div className="form-group">
					<label for="Sort" className="control-label">選擇一個搜尋方式</label>
					<select name="Sort" id="Sort" className="form-control">
						<option value="sort=f">投稿が新しい順</option>
						<option value="sort=v">再生が多い順</option>
						<option value="order=a">コメントが新しい順</option>
					</select>
				</div>
				<div className="form-group">
					<label for="what" className="control-label">找什麼？（Tag搜尋）</label>
					<input name="what" type="text" id="what" className="form-control" placeholder="輸入要搜尋的Tag"/>
				</div>
				<div className="form-group">
					<label for="Tag" className="control-label">或直接</label>
					<select name="Tag" id="Tag" className="form-control">
						<option value="">選一個Tag</option>
						<option value="日常">日常</option>
						<option value="台湾">台湾</option>
						<option value="手書き艦これ">手書き艦これ</option>
						<option value="艦これ">艦これ</option>
					</select>
					<button name="Tag" className="btn btn-primary">送出</button>
				</div>
			</div>
)

	}
}

class Menu extends React.Component{
	render(){
		return(
			<div id="menu" className="col-sm-6">
				<ul>		
					<li myList="12653834">ニコニコ週刊</li>
					<li name="2620730">凪尾さん</li>
					<li name="12433178" >アブさん（イカ）</li>
					<li name="14613584" >アブさん</li>
					<li id="weekly">週排行</li>
					<li id="dayily">日排行</li>
				</ul>
			</div>
		)
	}
}

class Bscomponent extends React.Component {
	render(){
		return (
			<div>
				<div className="container">
					<div className="row">
						<DivFormGroup/>
						<Menu/>
					</div>
				</div>
				<NicoSpan/>
			</div>
		)
	}
}

ReactDOM.render(
    <Bscomponent />,
    document.getElementById('headerpage')
);