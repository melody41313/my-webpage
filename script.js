// 🛎️ 顯示提示訊息
function showCustomMessage(msg, type = 'info') {
    const box = document.createElement('div');
    box.className = `custom-message ${type}`;
    box.textContent = msg;
    document.body.appendChild(box);
    setTimeout(() => box.classList.add('show'), 100);
    setTimeout(() => {
        box.classList.remove('show');
        setTimeout(() => box.remove(), 500);
    }, 3000);
}

// 📰 切換新聞類型（最多 5 個）
function toggleTag(tag) {
    if (tag.classList.contains('selected')) {
        tag.classList.remove('selected');
    } else {
        if (getTotalSelectedCount() >= 5) {
            showCustomMessage('⚠️ 最多只能選擇 5 個新聞類型或關鍵字！', 'error');
            return;
        }
        tag.classList.add('selected');
    }
    updateSummary();
}

// 🔍 新增自訂關鍵字（最多 5 個）
function addCustomKeyword() {
    const input = document.getElementById('custom-keyword');
    const keyword = input.value.trim();
    if (!keyword) {
        showCustomMessage('⚠️ 關鍵字不能為空！', 'error');
        return;
    }

    const container = document.getElementById('custom-tags-container');
    if (Array.from(container.children).some(el => el.textContent === keyword)) {
        showCustomMessage(`⚠️ 關鍵字 "${keyword}" 已存在！`, 'warning');
        return;
    }

    if (getTotalSelectedCount() >= 5) {
        showCustomMessage('⚠️ 最多只能選擇 5 個新聞類型或關鍵字！', 'error');
        return;
    }

    const tag = document.createElement('span');
    tag.className = 'tag selected';
    tag.textContent = keyword;
    tag.onclick = () => { tag.remove(); updateSummary(); };
    container.appendChild(tag);
    input.value = '';
    updateSummary();
}

// 📊 計算已選擇的總數（標籤 + 關鍵字）
function getTotalSelectedCount() {
    const topics = document.querySelectorAll('#tags-container .tag.selected').length;
    const keywords = document.getElementById('custom-tags-container').children.length;
    return topics + keywords; // 返回總數（最多 5 個）
}

// 📋 更新摘要（確保動態字串顏色可用）
function updateSummary() {
    const tags = Array.from(document.querySelectorAll('.tag.selected')).map(t => t.textContent);
    const freq = document.getElementById('frequency-select').value;
    const time = document.getElementById('global-time').value;

    // 🛠️ 使用 span 標籤包裝動態字串，確保顏色應用
    const summaryText = tags.length
        ? `我希望 <span class="freq-text">${freq}${time}</span> 收到 <span class="tags-text">${tags.join('、')}</span> 相關新聞！`
        : '請選擇新聞類型發送頻率與時間，<br>我們將為你客製新聞電子報！';

    document.getElementById('summary-text').innerHTML = summaryText;
}


// 📧 訂閱按鈕事件
document.getElementById('subscribe-btn').addEventListener('click', () => {
    if (getTotalSelectedCount() === 0) {
        showCustomMessage('⚠️ 請選擇至少一個新聞類型！', 'error');
        return;
    }
    document.getElementById('emailPopup').classList.remove('hidden');
    document.getElementById('overlay').classList.remove('hidden');
});

// ❌ 關閉彈窗
function closePopup() {
    document.getElementById('emailPopup').classList.add('hidden');
    document.getElementById('overlay').classList.add('hidden');
}

// 📤 提交信箱
function submitEmail() {
    const email = document.getElementById('emailInput').value.trim();
    const error = document.getElementById('emailError');
    if (!email) {
        error.textContent = '⚠️ 請輸入電子郵件地址！';
        return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
        error.textContent = '⚠️ 請輸入有效的電子郵件地址！';
        return;
    }
    error.textContent = '';
    closePopup();
    showCustomMessage(`🎉 訂閱成功！電子郵件：${email}`, 'success');
}