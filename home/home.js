$(document).ready(function () {
  // 使用async/await处理异步请求，页面一言
  async function fetchAndUpdateHitokoto() {
    try {
      const response = await fetch('https://v1.hitokoto.cn?c=d&c=i&c=k');
      const data = await response.json();
      console.log(data); // 打印返回的JSON数据，确保数据结构正确
      console.log(data.hitokoto); // 打印hitokoto字段，确保其值不为undefined
      $('#hitokoto_text').text(data.hitokoto + ' —— ' + data.from);
    } catch (error) {
      console.error(error);
    }
  }
  // 立即执行一次，并每隔十秒更新一次一言内容
  fetchAndUpdateHitokoto();
  setInterval(fetchAndUpdateHitokoto, 10000);
// 公告
$(document).ready(function() {
  $('#explain').click(function() {
    $('#overlay').css('display', 'flex');
  });

  $('#closePopup').click(function() {
    $('#overlay').css('display', 'none');
  });
});
// 关闭公告
  const overlay = $("#overlay");
  overlay.on("click", function () {
      overlay.hide();
  });
  // 阻止点击弹窗内容区域时冒泡到遮罩层的点击事件
  $("#popup").on("click", function (event) {
      event.stopPropagation();
  });


// 搜索功能
  const keyWordsInput = $('#keyWords');
  const searchResults = $('#searchResults');

  keyWordsInput.on('input', async function () {
    const keyWord = keyWordsInput.val().trim();
    try {
      if (keyWord === '') {
        searchResults.empty(); // 清空搜索结果
        return;
      }

      const dataToSend = {
        keyWord: keyWord,
      };
      const token = localStorage.getItem('token');
      const response = await fetch('https://ycl0.top/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dataToSend),
      });

      const searchData = await response.json();
      console.log('服务器返回数据：', searchData);

      searchResults.empty(); // 清空之前的搜索结果

      // if (searchData.success) {
      //   for (const result of searchData.data) {
      //     const resultElement = $(`<div class="search-result">
      //         <p><strong>关键词:</strong> ${result.keywords}</p>
      //         <p><strong>内容:</strong> ${result.content}</p>
      //         <p><strong>创建时间:</strong> ${result.created_at}</p>
      //         <p><strong>更新时间:</strong> ${result.updated_at}</p>
      //       </div>`);
            
      //     searchResults.append(resultElement);
      //     // 动画
      //     $('.search-result').each(function(index) {
      //       $(this).css({
      //         'animation': 'slideIn 0.5s ease-in-out ' + (index * 0.2) + 's',
      //         'opacity': '1'
      //       });
      //     });
      //   }
      // }
      if (searchData.success) {
        const searchResults = $('.search-results'); // 搜索结果容器
        const delay = 400; // 延迟时间，单位为毫秒
      
        searchData.data.forEach(function(result, index) {
          const resultElement = $(`<div class="search-result">
              <p><strong>关键词:</strong> ${result.keywords}</p>
              <p><strong>内容:</strong> ${result.content}</p>
              <p><strong>创建时间:</strong> ${result.created_at}</p>
              <p><strong>更新时间:</strong> ${result.updated_at}</p>
            </div>`);
      
          // 设置初始透明度为 0，以便容器初始状态为隐藏
          resultElement.css('opacity', 0);
      
          // 将容器添加到 searchResults 容器
          searchResults.append(resultElement);
      
          // 为每个容器设置逐个出现的延迟效果和动画
          resultElement.delay(index * delay).queue(function(next) {
            $(this).css({
              'animation': 'slideIn 0.5s ease-in-out',
              'opacity': '1'
            });
            next();
          });
        });
      }
      

    } catch (error) {
      console.error('错误信息：', error);
    }
  });
});
