// Khởi tạo danh sách đề
const testListEl = document.getElementById('test-list');

const groups = [
    { name: 'Lý thuyết chung', ids: ['theory'] },
    { name: 'Nhóm lợi ích / Vai trò', ids: ['test1', 'test4', 'test6', 'test9', 'test14', 'test15', 'test20', 'test21'] },
    { name: 'Nhóm bất lợi', ids: ['test5', 'test10'] },
    { name: 'Nhóm nguyên nhân', ids: ['test12', 'test17', 'test18', 'test19'] },
    { name: 'Nhóm giải pháp / Cách thức', ids: ['test2', 'test16'] },
    { name: 'Nhóm yếu tố', ids: ['test7', 'test13'] },
    { name: 'Nhóm quan điểm / Hiện tượng', ids: ['test3', 'test11'] }
];

const allTestIds = groups.flatMap(g => g.ids);
let currentTestId = 'theory';

// --- MOBILE SIDEBAR DRAWER CONTROLS ---
function openMobileSidebar() {
    const sidebar = document.getElementById('left-panel');
    const backdrop = document.getElementById('sidebar-backdrop');
    if (sidebar) sidebar.classList.add('mobile-open');
    if (backdrop) backdrop.classList.add('active');
    document.body.classList.add('mobile-drawer-open');
}

function closeMobileSidebar() {
    const sidebar = document.getElementById('left-panel');
    const backdrop = document.getElementById('sidebar-backdrop');
    if (sidebar) sidebar.classList.remove('mobile-open');
    if (backdrop) backdrop.classList.remove('active');
    document.body.classList.remove('mobile-drawer-open');
}

function toggleMobileSidebar() {
    const sidebar = document.getElementById('left-panel');
    if (sidebar && sidebar.classList.contains('mobile-open')) {
        closeMobileSidebar();
    } else {
        openMobileSidebar();
    }
}

// --- MOBILE QUICK NAVIGATION ---
function prevTest() {
    const currentIndex = allTestIds.indexOf(currentTestId);
    if (currentIndex > 0) {
        const prevId = allTestIds[currentIndex - 1];
        const testItem = document.querySelector(`.test-item[data-id="${prevId}"]`);
        loadTest(prevId, testItem);
        revealTestInSidebar(testItem);
    }
}

function nextTest() {
    const currentIndex = allTestIds.indexOf(currentTestId);
    if (currentIndex < allTestIds.length - 1) {
        const nextId = allTestIds[currentIndex + 1];
        const testItem = document.querySelector(`.test-item[data-id="${nextId}"]`);
        loadTest(nextId, testItem);
        revealTestInSidebar(testItem);
    }
}

function revealTestInSidebar(testItem) {
    if (!testItem) return;
    const groupContent = testItem.closest('.group-content');
    if (groupContent && groupContent.classList.contains('hidden')) {
        groupContent.classList.remove('hidden');
        const header = groupContent.previousElementSibling;
        if (header) {
            header.classList.remove('collapsed');
            const toggle = header.querySelector('.group-toggle');
            if (toggle) toggle.innerHTML = '▼';
        }
    }
    // Cuộn nhẹ vào tầm mắt trong sidebar nếu cần
    testItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function initTestList() {
    testListEl.innerHTML = '';
    let firstTestItem = null;

    groups.forEach(group => {
        // Tạo header cho nhóm
        const header = document.createElement('div');
        header.className = 'group-header';
        header.innerHTML = `<span>${group.name}</span><span class="group-toggle">▼</span>`;
        testListEl.appendChild(header);

        // Tạo container cho danh sách đề của nhóm
        const content = document.createElement('div');
        content.className = 'group-content';
        testListEl.appendChild(content);

        // Xử lý sự kiện thu gọn / bung ra
        header.onclick = () => {
            const isHidden = content.classList.contains('hidden');
            if (isHidden) {
                content.classList.remove('hidden');
                header.classList.remove('collapsed');
                header.querySelector('.group-toggle').innerHTML = '▼';
            } else {
                content.classList.add('hidden');
                header.classList.add('collapsed');
                header.querySelector('.group-toggle').innerHTML = '▶';
            }
        };

        // Render các đề trong nhóm
        group.ids.forEach(id => {
            const test = mockTests.find(t => t.id === id);
            if (!test) return;

            let displayTopic = test.topic;
            if (test.promptVn) {
                const match = test.promptVn.match(/<strong>Chủ đề:<\/strong>\s*(.*?)(?:\.<br>|<br>)/);
                if (match && match[1]) {
                    displayTopic = match[1];
                }
            }

            const div = document.createElement('div');
            div.className = 'test-item';
            div.setAttribute('data-id', test.id);
            if (id === 'theory') {
                div.classList.add('theory-tab');
            }
            div.innerHTML = `<h4>${test.title}</h4><p class="test-item-desc">${displayTopic}</p>`;
            div.onclick = () => loadTest(test.id, div);
            content.appendChild(div);

            if (!firstTestItem) {
                firstTestItem = div;
                div.classList.add('active');
            }
        });
    });

    if (firstTestItem && mockTests.length > 0) {
        loadTest(mockTests.find(t => t.id === groups[0].ids[0]).id, firstTestItem);
    }
}

// Tải nội dung đề
function loadTest(id, element) {
    currentTestId = id;
    
    document.querySelectorAll('.test-item').forEach(el => el.classList.remove('active'));
    if (element) {
        element.classList.add('active');
    } else {
        const found = document.querySelector(`.test-item[data-id="${id}"]`);
        if (found) found.classList.add('active');
    }

    const test = mockTests.find(t => t.id === id);
    if (!test) return;

    // Cập nhật tiêu đề Mobile Header
    const mobileTitleEl = document.getElementById('mobile-current-title');
    if (mobileTitleEl) {
        mobileTitleEl.innerText = test.title;
    }

    // Cập nhật trạng thái nút Next/Prev trên mobile
    const prevBtn = document.getElementById('mobile-prev-btn');
    const nextBtn = document.getElementById('mobile-next-btn');
    const currentIndex = allTestIds.indexOf(id);
    if (prevBtn) prevBtn.disabled = (currentIndex <= 0);
    if (nextBtn) nextBtn.disabled = (currentIndex >= allTestIds.length - 1);

    // Tự động đóng mobile sidebar khi chọn đề
    closeMobileSidebar();

    // Cuộn trang về đỉnh
    const centerPanel = document.getElementById('center-panel');
    if (centerPanel) centerPanel.scrollTop = 0;
    window.scrollTo({ top: 0, behavior: 'smooth' });

    document.getElementById('prompt-en').innerHTML = test.promptEn;
    document.getElementById('prompt-vn').innerHTML = test.promptVn;
    document.getElementById('vocab-content').innerHTML = test.vocab;
    // Render bài mẫu theo từng đoạn
    const sampleContainer = document.getElementById('sample-container');
    if (sampleContainer) {
        sampleContainer.innerHTML = ''; // Xóa nội dung cũ
        if(test.sample && test.sample.length > 0) {
            test.sample.forEach((para, index) => {
                const paraDiv = document.createElement('div');
                paraDiv.className = 'paragraph-wrapper';
                
                let enHtml = para.en;
                
                if (index === 0) {
                    const match = enHtml.match(/^Today,\s+I(?:'d|\s+would)\s+like\s+to\s+talk\s+about\s+/i);
                    if (match) {
                        const prefix = match[0];
                        const remaining = enHtml.substring(prefix.length);
                        enHtml = prefix + `<span style="color: #ff003c; text-shadow: 0 0 5px rgba(255,0,60,0.5); font-weight: bold;">${remaining}</span>`;
                    }
                } else if (index >= 1 && index <= 3) {
                    const firstDotIndex = enHtml.indexOf('. ');
                    if (firstDotIndex !== -1) {
                        const firstSentence = enHtml.substring(0, firstDotIndex + 1);
                        const rest = enHtml.substring(firstDotIndex + 1);
                        enHtml = `<span style="color: #0066ff; text-shadow: 0 0 5px rgba(0,102,255,0.4); font-weight: bold;">${firstSentence}</span> ` + rest;
                    } else {
                        enHtml = `<span style="color: #0066ff; text-shadow: 0 0 5px rgba(0,102,255,0.4); font-weight: bold;">${enHtml}</span>`;
                    }
                } else if (index === test.sample.length - 1) {
                    const match = enHtml.match(/To sum up, it[’']s true that/i);
                    if (match) {
                        const prefix = match[0];
                        const idx = enHtml.indexOf(prefix) + prefix.length;
                        const remaining = enHtml.substring(idx);
                        enHtml = enHtml.substring(0, idx) + `<span style="color: #ff003c; text-shadow: 0 0 5px rgba(255,0,60,0.5); font-weight: bold;">${remaining}</span>`;
                    }
                }
                
                const enP = document.createElement('p');
                enP.className = 'paragraph-en clickable-text';
                enP.innerHTML = enHtml;
                enP.onclick = () => {
                    const vnP = paraDiv.querySelector('.paragraph-vn');
                    vnP.style.display = (vnP.style.display === 'block') ? 'none' : 'block';
                };
                
                const vnP = document.createElement('p');
                vnP.className = 'paragraph-vn translation';
                vnP.innerHTML = para.vn;
                
                paraDiv.appendChild(enP);
                paraDiv.appendChild(vnP);
                sampleContainer.appendChild(paraDiv);
            });
        }
    }

    // Ẩn bản dịch đề bài khi chuyển đề
    document.getElementById('prompt-vn').style.display = 'none';
    
    const vocabEl = document.getElementById('vocab-content');
    if(!vocabEl.classList.contains('hidden') && id !== 'theory') toggleContent('vocab-content', vocabEl.previousElementSibling.querySelector('button'));
    
    const sampleEl = document.getElementById('sample-content-wrapper');
    if(!sampleEl.classList.contains('hidden') && id !== 'theory') toggleContent('sample-content-wrapper', sampleEl.previousElementSibling.querySelector('button'));

    // Cập nhật tiêu đề Card cho Lý thuyết chung vs Đề bài
    const promptCard = document.getElementById('prompt-en').closest('.content-card');
    const promptSectionHeader = document.getElementById('prompt-section-header');
    const vocabCard = document.getElementById('vocab-content').closest('.content-card');
    const sampleCard = document.getElementById('sample-content-wrapper').closest('.content-card');

    if (id === 'theory') {
        promptCard.classList.remove('prompt-card-redesigned');
        if (promptSectionHeader) {
            promptSectionHeader.style.display = 'flex';
            promptSectionHeader.querySelector('h3').innerText = 'Thông tin chung';
            const promptHint = promptSectionHeader.querySelector('.hint');
            if (promptHint) promptHint.style.display = 'none';
        }
        
        const promptContainer = document.getElementById('prompt-en').parentElement;
        if (promptContainer) {
            promptContainer.classList.remove('clickable-text');
            promptContainer.style.cursor = 'default';
        }
        document.getElementById('prompt-vn').style.display = 'none';
        
        vocabCard.querySelector('.section-header h3').innerText = 'Dàn ý bài nói';
        const vocabBtn = vocabCard.querySelector('.section-header button');
        if(vocabBtn) vocabBtn.style.display = 'none';
        vocabEl.classList.remove('hidden');

        sampleCard.style.display = 'none';
    } else {
        promptCard.classList.add('prompt-card-redesigned');
        if (promptSectionHeader) {
            promptSectionHeader.style.display = 'none';
        }
        
        const promptContainer = document.getElementById('prompt-en').parentElement;
        if (promptContainer) {
            promptContainer.classList.remove('clickable-text');
            promptContainer.style.cursor = 'default';
        }
        
        vocabCard.querySelector('.section-header h3').innerText = 'Từ vựng & Ý tưởng';
        const vocabBtn = vocabCard.querySelector('.section-header button');
        if(vocabBtn) {
            vocabBtn.style.display = 'block';
            if (!vocabEl.classList.contains('hidden')) {
                vocabBtn.innerText = 'Đang hiện';
                vocabBtn.classList.remove('btn-outline');
            } else {
                vocabBtn.innerText = 'Hiện / Ẩn';
                vocabBtn.classList.add('btn-outline');
            }
        }
        
        sampleCard.style.display = 'block';
    }
}

// --- TƯƠNG TÁC MINDMAP & KHUNG ĐỀ BÀI MỚI ---
window.toggleNodeVn = function(nodeEl) {
    if (!nodeEl) return;
    nodeEl.classList.toggle('vn-hidden');
};

window.toggleTopicHeadlineVn = function(blockEl) {
    if (!blockEl) return;
    blockEl.classList.toggle('vn-shown');
};

// --- TƯƠNG TÁC TỪ VỰNG & Ý TƯỞNG MỚI (TIẾNG VIỆT -> LẬT TIẾNG ANH) ---
window.toggleExpStep = function(stepEl) {
    if (!stepEl) return;
    stepEl.classList.toggle('show-en');
    syncExpToggleAllBtn(stepEl.closest('.exp-section'));
};

window.toggleExpHeader = function(headerEl) {
    if (!headerEl) return;
    headerEl.classList.toggle('show-en');
    syncExpToggleAllBtn(headerEl.closest('.exp-section'));
};

window.toggleAllExpEn = function(btnEl) {
    const section = btnEl.closest('.exp-section');
    if (!section) return;
    const targets = section.querySelectorAll('.exp-step-card, .exp-card-header');
    const allShown = Array.from(targets).every(el => el.classList.contains('show-en'));

    targets.forEach(el => {
        if (allShown) {
            el.classList.remove('show-en');
        } else {
            el.classList.add('show-en');
        }
    });
    syncExpToggleAllBtn(section);
};

function syncExpToggleAllBtn(section) {
    if (!section) return;
    const btn = section.querySelector('.exp-toggle-all-btn');
    if (!btn) return;
    const targets = section.querySelectorAll('.exp-step-card, .exp-card-header');
    const allShown = targets.length > 0 && Array.from(targets).every(el => el.classList.contains('show-en'));
    btn.innerText = allShown ? 'Ẩn tất cả tiếng Anh' : 'Hiện tất cả tiếng Anh';
    btn.classList.toggle('active', allShown);
}

function toggleRightPanel() {
    const panel = document.getElementById('right-panel');
    const icon = document.querySelector('#toggle-right .icon');
    
    panel.classList.toggle('collapsed');
    if (panel.classList.contains('collapsed')) {
        icon.innerHTML = '◀';
    } else {
        icon.innerHTML = '▶';
    }
}

// Ẩn/Hiện bản dịch
function toggleTranslation(id) {
    const currentActive = document.querySelector('.test-item.active');
    if (currentActive && currentActive.classList.contains('theory-tab')) return;
    
    const el = document.getElementById(id);
    if (el && el.innerHTML.trim() !== '') {
        el.style.display = (el.style.display === 'block') ? 'none' : 'block';
    }
}

// Ẩn/Hiện Vocab & Sample
function toggleContent(id, btn) {
    const el = document.getElementById(id);
    if (el.classList.contains('hidden')) {
        el.classList.remove('hidden');
        btn.classList.remove('btn-outline');
        btn.innerHTML = 'Đang hiện';
    } else {
        el.classList.add('hidden');
        btn.classList.add('btn-outline');
        btn.innerHTML = 'Hiện / Ẩn';
    }
}

// --- HỆ THỐNG ĐỒNG HỒ & ÂM THANH ---
let timerInterval;
let timeLeft = 300; // 5 phút = 300 giây
let totalTime = 300;
let isRunning = false;
let oneMinutePassed = false;
let audioCtx = null;
let alarmInterval = null;

const timerMin = document.getElementById('timer-min');
const timerSec = document.getElementById('timer-sec');
const timerBar = document.getElementById('timer-bar');
const timerStatusPill = document.getElementById('timer-status-pill');
const timerStatusText = document.getElementById('timer-status-text');
const timerModeTag = document.getElementById('timer-mode-tag');
const btnStart = document.getElementById('btn-start');

// Khởi tạo Audio Context
function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

// Tắt chuông báo
function stopAlarm() {
    if (alarmInterval) {
        clearInterval(alarmInterval);
        alarmInterval = null;
    }
}

// Tạo tiếng bíp
function playBeep(type) {
    if (!audioCtx) return;
    
    if (type === '1min') {
        // Tiếng bíp lặp lại 2 lần (bíp bíp)
        for(let i=0; i<2; i++) {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            
            osc.frequency.setValueAtTime(800, audioCtx.currentTime + i * 0.4);
            gain.gain.setValueAtTime(0.5, audioCtx.currentTime + i * 0.4);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + i * 0.4 + 0.2);
            osc.start(audioCtx.currentTime + i * 0.4);
            osc.stop(audioCtx.currentTime + i * 0.4 + 0.2);
        }
    } else if (type === 'end') {
        stopAlarm(); // Xoá báo thức cũ nếu có
        
        // Lặp lại liên tục cho đến khi user reset
        alarmInterval = setInterval(() => {
            const oscEnd = audioCtx.createOscillator();
            const gainEnd = audioCtx.createGain();
            oscEnd.type = 'square';
            oscEnd.connect(gainEnd);
            gainEnd.connect(audioCtx.destination);
            
            oscEnd.frequency.setValueAtTime(600, audioCtx.currentTime);
            gainEnd.gain.setValueAtTime(0.5, audioCtx.currentTime);
            gainEnd.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
            oscEnd.start(audioCtx.currentTime);
            oscEnd.stop(audioCtx.currentTime + 0.3);
        }, 500);
    }
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    
    if (timerMin) timerMin.innerText = minutes.toString().padStart(2, '0');
    if (timerSec) timerSec.innerText = seconds.toString().padStart(2, '0');
    
    // Cập nhật thanh tiến trình
    const percentage = totalTime > 0 ? (timeLeft / totalTime) * 100 : 0;
    if (timerBar) {
        timerBar.style.width = `${percentage}%`;
        if (percentage <= 20) {
            timerBar.classList.add('urgent');
        } else {
            timerBar.classList.remove('urgent');
        }
    }
}

function setTimerStatus(status) {
    if (!timerStatusPill || !timerStatusText) return;
    timerStatusPill.className = 'timer-status-pill';
    
    if (status === 'running') {
        timerStatusPill.classList.add('status-running');
        timerStatusText.innerText = 'ĐANG ĐẾM';
    } else if (status === 'paused') {
        timerStatusPill.classList.add('status-paused');
        timerStatusText.innerText = 'TẠM DỪNG';
    } else if (status === 'ended') {
        timerStatusPill.classList.add('status-ended');
        timerStatusText.innerText = 'HẾT GIỜ';
    } else {
        timerStatusText.innerText = 'SẴN SÀNG';
    }
}

function updateStartButton(running) {
    if (!btnStart) return;
    const btnIcon = btnStart.querySelector('.btn-icon');
    const btnLabel = btnStart.querySelector('.btn-label');
    
    if (running) {
        btnStart.classList.add('running');
        if (btnIcon) btnIcon.innerText = '⏸';
        if (btnLabel) btnLabel.innerText = 'Tạm dừng';
    } else {
        btnStart.classList.remove('running');
        if (btnIcon) btnIcon.innerText = '▶';
        if (btnLabel) btnLabel.innerText = (timeLeft < totalTime && timeLeft > 0) ? 'Tiếp tục' : 'Bắt đầu';
    }
}

function toggleTimer() {
    initAudio(); // Phải khởi tạo audio từ thao tác của user
    stopAlarm(); // Tắt báo thức nếu đang reo
    
    if (isRunning) {
        clearInterval(timerInterval);
        isRunning = false;
        updateStartButton(false);
        setTimerStatus('paused');
    } else {
        if (timeLeft <= 0) return;
        isRunning = true;
        updateStartButton(true);
        setTimerStatus('running');
        
        timerInterval = setInterval(() => {
            timeLeft--;
            updateTimerDisplay();

            // Báo hiệu hết 1 phút đầu tiên (còn 240 giây)
            if (timeLeft === 240 && !oneMinutePassed) {
                playBeep('1min');
                oneMinutePassed = true;
            }

            // Hết giờ
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                isRunning = false;
                updateStartButton(false);
                setTimerStatus('ended');
                playBeep('end');
            }
        }, 1000);
    }
}

function setTimer(seconds) {
    stopAlarm(); // Tắt báo thức nếu đang reo
    clearInterval(timerInterval);
    timeLeft = seconds;
    totalTime = seconds;
    isRunning = false;
    oneMinutePassed = false;
    updateStartButton(false);
    setTimerStatus('ready');
    if (timerModeTag) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        timerModeTag.innerText = `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    updateTimerDisplay();
}

function resetTimer() {
    setTimer(totalTime || 300);
}

// Gọi hàm khởi tạo
initTestList();

// --- TRA CỨU IPA (CHUẨN CAMBRIDGE / DICTIONARY API) ---
async function lookupIPA() {
    const input = document.getElementById('ipa-input');
    const resultSpan = document.getElementById('ipa-result');
    if (!input || !resultSpan) return;
    const word = input.innerText.trim();
    
    if (!word) {
        resultSpan.textContent = '';
        return;
    }
    
    resultSpan.textContent = '...';
    resultSpan.style.color = '#64748b';

    try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`);
        if (!response.ok) {
            throw new Error('Not found');
        }
        const data = await response.json();
        
        let ipa = '';
        if (data[0].phonetic) {
            ipa = data[0].phonetic;
        } else if (data[0].phonetics && data[0].phonetics.length > 0) {
            const phoneticWithText = data[0].phonetics.find(p => p.text);
            if (phoneticWithText) {
                ipa = phoneticWithText.text;
            }
        }
        
        if (ipa) {
            // Chuẩn hóa ký tự IPA về dạng Cambridge cơ bản
            ipa = ipa.replace(/\u0361/g, '') // Xóa dấu gạch nối (tie bar) d͡ʒ -> dʒ, t͡ʃ -> tʃ
                     .replace(/ɹ/g, 'r')    // r lật ngược -> r bình thường
                     .replace(/ɫ/g, 'l')    // dark l -> l
                     .replace(/ɛ/g, 'e');   // ɛ -> e (phổ biến trong Cambridge)
                     
            resultSpan.textContent = ipa;
            resultSpan.style.color = '#065f46'; // Dark green
        } else {
            resultSpan.textContent = '(N/A)';
            resultSpan.style.color = '#b91c1c';
        }
        
    } catch (error) {
        resultSpan.textContent = '(Không tìm thấy)';
        resultSpan.style.color = '#b91c1c';
    }
}
