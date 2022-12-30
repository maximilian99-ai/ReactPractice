import React, { Component } from 'react';

class Nav extends Component {
  state = {
    list:[]
  }
  render() {
    var listTag = [];
    for(var i=0; i<this.props.list.length; i++) {
      var li = this.props.list[i];
      listTag.push(<li key={li.id}>
                    <a href={li.id} data-id={li.id} onClick={function(e) {
                      e.preventDefault();
                      console.log('trigger');
                      this.props.onClick(e.target.dataset.id);
                    }.bind(this)}>
                      {li.title}
                    </a>
                  </li>)
    }
    return (
      <nav>
        <ul>
          {listTag}
        </ul>
      </nav>
    );
  }
}

class Article extends Component {
  render() {
    return(
      <article>
        <h2>{this.props.title}</h2>
        {this.props.desc}
      </article>
    );
  }
}

class NowLoading extends Component {
  render() {
    return <div>Now Loading...</div>
  }
}

class App extends Component {
  state = {
    article:{
      item:{title:'Welcome', desc:'Hello, React & Ajax'},
      isLoding:false
    },
    list:{
      items:[],
      isLoding:false
    }
  }
  componentDidMount() {
    var newList = Object.assign({}, this.state.list, {isLoding: true});
    this.setState({list: newList});
    fetch('list.json')
      .then(function(result) {
        return result.json();
      })
      .then(function(json) {
        console.log(json);
        this.setState({list: {
          items: json,
          isLoding:false
        }});
      }.bind(this));
  }
  render() {
    var NavTag = null;
    if(this.state.list.isLoding) {
      NavTag = <NowLoading></NowLoading>
    } else {
      NavTag = <Nav list={this.state.list.items} onClick={function(id) {
        var newArticle = Object.assign({}, this.state.article, {isLoding:true});
        this.setState({article: newArticle});
        fetch(id+'.json')
          .then(function(result){
            return result.json();
          })
          .then(function(json){
            this.setState({
              article:{
                item:{
                  title: json.title,
                  desc: json.desc
                },
                isLoding:false
              }})
          }.bind(this));
      }.bind(this)}></Nav>
    }

    var ArticleTag = null;
    if(this.state.article.isLoding) {
      ArticleTag = <NowLoading></NowLoading>
    } else {
      ArticleTag = <Article title={this.state.article.item.title} desc={this.state.article.item.desc}></Article>
    }

    return (
      <div className="App">
        <h1>Web</h1>
        {NavTag}
        {ArticleTag}
      </div>
    );
  }
}

export default App;