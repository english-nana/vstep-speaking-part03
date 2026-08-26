const generateMindmap = (center, top, left, right, bottom) => {
    return `
    <div class="mindmap">
        <div style="grid-column: 3; grid-row: 1;" class="mm-node">${top}</div>
        <div style="grid-column: 3; grid-row: 2;" class="mm-arrow arrow-up">
            <svg viewBox="0 0 24 40" width="24" height="40"><path d="M12 0 L24 12 L16 12 L16 40 L8 40 L8 12 L0 12 Z" fill="#fcd3d3" stroke="#1e293b" stroke-width="1.5"/></svg>
        </div>
        <div style="grid-column: 1; grid-row: 3;" class="mm-node">${left}</div>
        <div style="grid-column: 2; grid-row: 3;" class="mm-arrow arrow-left">
            <svg viewBox="0 0 40 24" width="40" height="24"><path d="M0 12 L12 0 L12 8 L40 8 L40 16 L12 16 L12 24 Z" fill="#fcd3d3" stroke="#1e293b" stroke-width="1.5"/></svg>
        </div>
        <div style="grid-column: 3; grid-row: 3;" class="mm-node mm-center">${center}</div>
        <div style="grid-column: 4; grid-row: 3;" class="mm-arrow arrow-right">
            <svg viewBox="0 0 40 24" width="40" height="24"><path d="M40 12 L28 0 L28 8 L0 8 L0 16 L28 16 L28 24 Z" fill="#fcd3d3" stroke="#1e293b" stroke-width="1.5"/></svg>
        </div>
        <div style="grid-column: 5; grid-row: 3;" class="mm-node">${right}</div>
        <div style="grid-column: 3; grid-row: 4;" class="mm-arrow arrow-down">
            <svg viewBox="0 0 24 40" width="24" height="40"><path d="M12 40 L0 28 L8 28 L8 0 L16 0 L16 28 L24 28 Z" fill="#fcd3d3" stroke="#1e293b" stroke-width="1.5"/></svg>
        </div>
        <div style="grid-column: 3; grid-row: 5;" class="mm-node">${bottom}</div>
    </div>
    `;
};

const generateVocabItem = (number, title, flowArray) => {
    const renderStyledText = (text) => {
        return text
            .replace(/\(not\)/gi, '(X)')
            .replace(/\(không\)/gi, '(X)')
            .replace(/\(X\)/g, '<strong style="color: #ff003c; text-shadow: 0 0 5px rgba(255,0,60,0.5); font-weight: bold;">(X)</strong>');
    };

    const createBubble = (enPart, vnPart, isExample) => {
        const bgStyle = isExample ? 'background-color: #fee2e2; border: 1px solid #fca5a5; color: #991b1b;' : '';
        const enHtml = renderStyledText(enPart.trim());
        let html = '';
        if (vnPart) {
            const vnHtml = renderStyledText(vnPart.trim());
            html = `
            <div class="flow-step" style="display: inline-flex; flex-direction: column; cursor: pointer; vertical-align: middle; ${bgStyle}" onclick="var vn = this.querySelector('.vocab-vn'); if(vn) { vn.style.display = vn.style.display === 'block' ? 'none' : 'block'; }">
                <span class="vocab-en">${enHtml}</span>
                <span class="vocab-vn" style="display: none; color: #0f766e; font-size: 13.5px; background: #f0fdfa; border-radius: 4px; padding: 2px 8px; margin-top: 4px; white-space: normal; max-width: 100%; border: 1px solid #ccfbf1;">${vnHtml}</span>
            </div>`;
        } else {
            html = `<div class="flow-step" style="${bgStyle}"><span class="vocab-en">${enHtml}</span></div>`;
        }
        return html;
    };

    const flowHtml = flowArray.map((step, index) => {
        let stepHtml = '';
        if (typeof step === 'string') {
            const partsEn = step.split('=>');
            let isExampleFlow = false;
            const bubbles = partsEn.map(p => {
                if (p.trim().startsWith('Ex:')) isExampleFlow = true;
                return createBubble(p, '', isExampleFlow);
            });
            stepHtml = bubbles.join('<div class="flow-arrow" style="vertical-align: middle;">➔</div>');
        } else {
            const partsEn = step.en.split('=>');
            const partsVn = step.vn ? step.vn.split('=>') : [];
            let isExampleFlow = false;
            const bubbles = partsEn.map((p, i) => {
                if (p.trim().startsWith('Ex:')) isExampleFlow = true;
                return createBubble(p, partsVn[i] || '', isExampleFlow);
            });
            stepHtml = bubbles.join('<div class="flow-arrow" style="vertical-align: middle;">➔</div>');
        }
        return stepHtml + (index < flowArray.length - 1 ? `<div class="flow-arrow" style="vertical-align: middle;">➔</div>` : '');
    }).join('');
    
    return `
    <div class="idea-card" style="position: relative;">
        <div style="position: absolute; top: 12px; right: 15px; display: flex; border: 1px solid #cbd5e1; border-radius: 6px; overflow: hidden; z-index: 10;">
            <span onclick="event.stopPropagation(); if(window.changeCardScale) changeCardScale(this, -0.15);" style="padding: 2px 10px; cursor: pointer; background: #f1f5f9; color: #64748b; font-weight: normal; font-size: 15px; user-select: none; border-right: 1px solid #cbd5e1;" onmouseover="this.style.background='#e2e8f0'" onmouseout="this.style.background='#f1f5f9'" title="Thu nhỏ">-</span>
            <span onclick="event.stopPropagation(); if(window.changeCardScale) changeCardScale(this, 0.15);" style="padding: 2px 10px; cursor: pointer; background: #f1f5f9; color: #64748b; font-weight: normal; font-size: 15px; user-select: none;" onmouseover="this.style.background='#e2e8f0'" onmouseout="this.style.background='#f1f5f9'" title="Phóng to">+</span>
        </div>
        <div class="idea-title"><span class="idea-number">${number}</span> ${title}</div>
        <div class="idea-flow" style="display: flex; flex-wrap: wrap; align-items: center; gap: 4px 0;">
            ${flowHtml}
        </div>
    </div>
    `;
};

// Add changeCardScale globally if not exists
if (typeof window !== 'undefined' && !window.changeCardScale) {
    window.changeCardScale = function(btn, delta) {
        var card = btn.closest('.idea-card');
        if (!card) return;
        var currentScale = parseFloat(card.getAttribute('data-scale')) || 1;
        var newScale = Math.max(0.5, Math.min(3, currentScale + delta));
        card.setAttribute('data-scale', newScale);
        
        var steps = card.querySelectorAll('.flow-step');
        steps.forEach(function(s) { s.style.fontSize = (14.5 * newScale) + 'px'; });
        
        var vns = card.querySelectorAll('.vocab-vn');
        vns.forEach(function(s) { s.style.fontSize = (13.5 * newScale) + 'px'; });
        
        var arrows = card.querySelectorAll('.flow-arrow');
        arrows.forEach(function(a) { a.style.fontSize = (16 * newScale) + 'px'; });
        
        var ens = card.querySelectorAll('.vocab-en');
        ens.forEach(function(s) { s.style.fontSize = (14.5 * newScale) + 'px'; });
    };
}


const mockTests = [
    {
        id: "theory",
        title: "Lý thuyết chung",
        topic: "Thông tin và dàn ý VSTEP Speaking Part 3",
        promptEn: `
<div style="line-height: 1.7; color: #1e293b;">
    <p style="margin-bottom: 12px;"><strong style="font-weight: 700; color: #0f172a;">Nội dung:</strong> 01 chủ đề xã hội + 03 main ideas của chủ đề đó => thí sinh cần phát triển 03 main ideas trong đề thành một bài nói hoàn chỉnh</p>
    <p style="margin-bottom: 12px;"><strong style="font-weight: 700; color: #0f172a;">Thời gian:</strong> 05 phút (01 phút chuẩn bị + 04 phút nói)</p>
    <p style="margin-bottom: 12px;"><strong style="font-weight: 700; color: #0f172a;">Câu hỏi mở rộng:</strong> sau khi nói xong chủ đề, vẫn còn 03 câu hỏi mở rộng liên quan tới chủ đề, thí sinh chỉ cần trả lời 01 trong 03 câu đó</p>
    <p style="margin-bottom: 12px;"><strong style="font-weight: 700; color: #0f172a;">Giao diện đề thi trên máy tính:</strong> Như trong hình minh họa bên dưới.</p>
    <div style="text-align: center; margin-top: 15px;">
        <img src="giao-dien.png" alt="Giao diện thi trên máy tính" style="max-width: 100%; border: 1px solid #cbd5e1; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
    </div>
</div>`,
        promptVn: ``,
        vocab: `
            <div class="vocab-section" style="text-align: left; padding: 10px 0;">
                <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; margin-bottom: 15px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                    <strong style="color: #0f766e; font-size: 16.5px; font-weight: 700; display: block; border-bottom: 1px solid #cbd5e1; padding-bottom: 8px; margin-bottom: 12px;">Mở bài:</strong>
                    <div style="color: #334155; font-size: 15.5px; line-height: 2.3;">
                        <span style="font-weight: 600; color: #0f172a; margin-right: 6px;">Today, I'd like to talk about</span>
                        <span class="intro-pill">the benefits of ...</span>
                        <span class="intro-pill">the downsides of ...</span>
                        <span class="intro-pill">the reasons why ...</span>
                        <span class="intro-pill">some ways to ...</span>
                        <span class="intro-pill">some factors to consider when/to ...</span>
                    </div>
                </div>

                <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; margin-bottom: 15px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                    <strong style="color: #0f766e; font-size: 16.5px; display: block; border-bottom: 1px solid #cbd5e1; padding-bottom: 8px; margin-bottom: 10px;">Thân bài:</strong>
                    <ul style="color: #334155; margin-top: 0; padding-left: 20px; line-height: 1.7; font-size: 15.5px;">
                        <li style="margin-bottom: 12px;"><strong style="color: #1d4ed8;">Firstly, / First of all</strong> + <em style="color: #ea580c; font-weight: 500;">main idea 01</em> <span style="color: #334155;">➔ giải thích + ví dụ + kết quả</span></li>
                        <li style="margin-bottom: 12px;"><strong style="color: #1d4ed8;">Secondly, / Besides, / Moreover</strong> + <em style="color: #ea580c; font-weight: 500;">main idea 02</em> <span style="color: #334155;">➔ giải thích + ví dụ + kết quả</span></li>
                        <li><strong style="color: #1d4ed8;">Finally,</strong> <em style="color: #ea580c; font-weight: 500;">main idea 03</em> <span style="color: #334155;">➔ giải thích + ví dụ + kết quả</span></li>
                    </ul>
                </div>

                <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                    <strong style="color: #0f766e; font-size: 16.5px; display: block; border-bottom: 1px solid #cbd5e1; padding-bottom: 8px; margin-bottom: 10px;">Kết bài:</strong>
                    <span style="color: #334155; display: inline-block; font-size: 15.5px; line-height: 2;">
                        <span style="display: inline-block; background-color: #f1f5f9; border: 1px solid #cbd5e1; color: #1d4ed8; padding: 1px 6px; border-radius: 4px; font-weight: bold; margin-right: 4px; font-size: 14.5px;">In conclusion,</span>
                        <span style="display: inline-block; background-color: #f1f5f9; border: 1px solid #cbd5e1; color: #1d4ed8; padding: 1px 6px; border-radius: 4px; font-weight: bold; margin-left: 2px; margin-right: 4px; font-size: 14.5px;">To sum up,</span> 
                        it's true that <strong style="color: #b91c1c;">[nguyên câu chủ đề]</strong>
                    </span>
                </div>
            </div>
        `,
        sample: []
    },
    {
        id: "test1",
        title: "Topic 01 🎵",
        topic: "Musical education plays a vital role in schools.",
        promptEn: `<strong>Topic:</strong> Musical education plays a vital role in schools.<br>` +
            generateMindmap('Musical education', 'memory development', 'emotional development', 'your own ideas', 'language development'),
        promptVn: `<strong>Chủ đề:</strong> Giáo dục âm nhạc đóng vai trò quan trọng trong trường học.<br>` +
            generateMindmap('Giáo dục âm nhạc', 'phát triển trí nhớ', 'phát triển cảm xúc', 'ý tưởng của bạn', 'phát triển ngôn ngữ'),
        vocab: `
            <div class="vocab-section">
                <div class="idea-cards">
                    ${generateVocabItem('01', 'Develop memory', [
                        'learn how to sing a song + learn a new instrument',
                        'remember the lyrics and the melody',
                        'remember longer'
                    ])}
                    ${generateVocabItem('02', 'Develop emotions', [
                        'express emotions (anger, happiness, sadness) + feel relaxed after long hours of studying'
                    ])}
                    ${generateVocabItem('03', 'Learn languages', [
                        'sing English songs',
                        'learn new vocabulary + improve listening skills + improve pronunciation'
                    ])}
                </div>
            </div>
        `,
        sample: [
            {
                en: "Today, I'd like to talk about musical education.",
                vn: "Hôm nay, tôi muốn nói về giáo dục âm nhạc."
            },
            {
                en: "Firstly, musical education helps students develop memory. This is because when students learn how to sing a song or learn a new instrument, they need to remember the lyrics and the melody of the song. As a result, they can train their brains to remember longer.",
                vn: "Đầu tiên, giáo dục âm nhạc giúp học sinh phát triển trí nhớ. Điều này là do khi học sinh học hát hoặc học một nhạc cụ mới, họ cần nhớ lời và giai điệu của bài hát. Kết quả là, họ có thể rèn luyện não bộ để nhớ lâu hơn."
            },
            {
                en: "Moreover, musical education helps students develop emotions. This is because music can help people express their emotions. It also helps students feel relaxed and more positive.",
                vn: "Hơn nữa, giáo dục âm nhạc giúp học sinh phát triển cảm xúc. Điều này là do âm nhạc có thể giúp con người thể hiện cảm xúc của mình. Nó cũng giúp học sinh cảm thấy thư giãn và tích cực hơn."
            },
            {
                en: "Finally, it’s also a great way to learn languages. For example, when students sing English songs, they can learn English vocabulary and improve listening skills. They can also improve pronunciation.",
                vn: "Cuối cùng, nó cũng là một cách tuyệt vời để học ngôn ngữ. Ví dụ, khi học sinh hát các bài hát tiếng Anh, họ có thể học từ vựng tiếng Anh và cải thiện kỹ năng nghe. Họ cũng có thể cải thiện phát âm."
            },
            {
                en: "To sum up, it’s true that musical education plays a vital role in schools.",
                vn: "Tóm lại, đúng là giáo dục âm nhạc đóng vai trò quan trọng trong trường học."
            }
        ]
    },
    {
        id: "test2",
        title: "Topic 02 👮",
        topic: "The crime rate can be reduced in several ways.",
        promptEn: `<strong>Topic:</strong> The crime rate can be reduced in several ways.<br>` +
            generateMindmap('The crime rate', 'Education', 'Install camera in public places', 'your own ideas', 'Increase employment opportunities'),
        promptVn: `<strong>Chủ đề:</strong> Tỷ lệ tội phạm có thể được giảm bằng nhiều cách.<br>` +
            generateMindmap('Tỷ lệ tội phạm', 'Giáo dục', 'Lắp camera ở nơi công cộng', 'ý tưởng của bạn', 'Tăng cơ hội việc làm'),
        vocab: `
            <div class="vocab-section">
                <div class="idea-cards">
                    ${generateVocabItem('01', 'Education', [
                        'understand what is right and wrong',
                        'be well-educated',
                        'be less likely to commit crimes'
                    ])}
                    ${generateVocabItem('02', 'Install cameras in public places', [
                        'know they are being watched',
                        'be less likely to do illegal activities',
                        'make people feel safe'
                    ])}
                    ${generateVocabItem('03', 'Increase employment opportunities', [
                        'have jobs',
                        'earn money in a legal way + support themselves',
                        'don’t need to commit crimes to survive'
                    ])}
                </div>
            </div>
        `,
        sample: [
            {
                en: "Today, I'd like to talk about the crime rate.",
                vn: "Hôm nay, tôi muốn nói về tỷ lệ tội phạm."
            },
            {
                en: "Firstly, one way to reduce the crime rate is education. This is because education helps people understand what is right and wrong. When people are well-educated, they will be less likely to commit crimes.",
                vn: "Đầu tiên, một cách để giảm tỷ lệ tội phạm là giáo dục. Điều này là do giáo dục giúp mọi người hiểu điều gì là đúng và sai. Khi mọi người được giáo dục tốt, họ sẽ ít có khả năng phạm tội hơn."
            },
            {
                en: "Moreover, we can reduce crime by installing cameras in public places. When people know they are being watched, they will be less likely to do illegal activities. Therefore, cameras can make people feel safe.",
                vn: "Hơn nữa, chúng ta có thể giảm tội phạm bằng cách lắp đặt camera ở những nơi công cộng. Khi mọi người biết họ đang bị theo dõi, họ sẽ ít có khả năng thực hiện các hoạt động bất hợp pháp. Do đó, camera có thể làm cho mọi người cảm thấy an toàn."
            },
            {
                en: "Finally, we can reduce crime by increasing employment opportunities. When people have jobs, they can earn money in a legal way and support themselves. So, they don’t need to commit crimes to survive.",
                vn: "Cuối cùng, chúng ta có thể giảm tội phạm bằng cách tăng cơ hội việc làm. Khi mọi người có việc làm, họ có thể kiếm tiền một cách hợp pháp và nuôi sống bản thân. Vì vậy, họ không cần phải phạm tội để tồn tại."
            },
            {
                en: "To sum up, it’s true that the crime rate can be reduced in several ways.",
                vn: "Tóm lại, đúng là tỷ lệ tội phạm có thể được giảm bằng nhiều cách."
            }
        ]
    },
    {
        id: "test3",
        title: "Topic 03 🧹",
        topic: "Housemaids are becoming more common in many urban families.",
        promptEn: `<strong>Topic:</strong> Housemaids are becoming more common in many urban families.<br>` +
            generateMindmap('Housemaids', 'More relaxing time', 'A tidier home', 'your own ideas', 'Better social skills for family members'),
        promptVn: `<strong>Chủ đề:</strong> Người giúp việc gia đình đang trở nên phổ biến hơn ở nhiều gia đình thành thị.<br>` +
            generateMindmap('Người giúp việc gia đình', 'Có thêm thời gian thư giãn', 'Ngôi nhà gọn gàng hơn', 'ý tưởng của bạn', 'Kỹ năng xã hội tốt hơn cho các thành viên'),
        vocab: `
            <div class="vocab-section">
                <div class="idea-cards">
                    ${generateVocabItem('01', 'Family members will have more relaxing time', [
                        'many people',
                        'busy with their work',
                        'don’t have much time to do the housework',
                        'hire a housemaid',
                        'have more time to rest'
                    ])}
                    ${generateVocabItem('02', 'A housemaid can make the house tidier', [
                        'do the housework (cleaning the house + washing clothes + washing dishes)',
                        'make the house cleaner and tidier'
                    ])}
                    ${generateVocabItem('03', 'Having a housemaid helps family members develop social skills', [
                        'children',
                        'learn how to communicate + behave politely',
                        'become more friendly'
                    ])}
                </div>
            </div>
        `,
        sample: [
            {
                en: "Today, I'd like to talk about housemaids.",
                vn: "Hôm nay, tôi muốn nói về người giúp việc gia đình."
            },
            {
                en: "Firstly, family members will have more relaxing time. This is because in urban cities, many people are too busy with their work. They don’t have much time to do the housework, so they decide to hire a housemaid to have more time to rest.",
                vn: "Đầu tiên, các thành viên trong gia đình sẽ có nhiều thời gian thư giãn hơn. Điều này là do ở các thành phố đô thị, nhiều người quá bận rộn với công việc của họ. Họ không có nhiều thời gian để làm việc nhà, vì vậy họ quyết định thuê người giúp việc để có thêm thời gian nghỉ ngơi."
            },
            {
                en: "Moreover, a housemaid can make the house tidier. A housemaid can do the housework like cleaning the house, washing clothes and washing dishes. Therefore, the house will become cleaner and tidier.",
                vn: "Hơn nữa, một người giúp việc có thể làm cho ngôi nhà gọn gàng hơn. Một người giúp việc có thể làm việc nhà như dọn dẹp nhà cửa, giặt quần áo và rửa chén bát. Do đó, ngôi nhà sẽ trở nên sạch sẽ và gọn gàng hơn."
            },
            {
                en: "Finally, having a housemaid helps family members develop social skills. Children can learn how to communicate and behave politely. Therefore, they will become more friendly.",
                vn: "Cuối cùng, việc có người giúp việc giúp các thành viên trong gia đình phát triển kỹ năng xã hội. Trẻ em có thể học cách giao tiếp và cư xử lịch sự. Do đó, chúng sẽ trở nên thân thiện hơn."
            },
            {
                en: "To sum up, it’s true that housemaids are becoming more common in many urban families.",
                vn: "Tóm lại, đúng là người giúp việc gia đình đang trở nên phổ biến hơn ở nhiều gia đình thành thị."
            }
        ]
    },
    {
        id: "test4",
        title: "Topic 04 🏢",
        topic: "Staying in a dormitory offers students many benefits.",
        promptEn: `<strong>Topic:</strong> Staying in a dormitory offers students many benefits.<br>` +
            generateMindmap('Staying in a dormitory', 'Making friends', 'Nearby classes', 'your own ideas', 'Learning more skills'),
        promptVn: `<strong>Chủ đề:</strong> Ở ký túc xá mang lại nhiều lợi ích cho sinh viên.<br>` +
            generateMindmap('Ở ký túc xá', 'Kết bạn', 'Gần lớp học', 'ý tưởng của bạn', 'Học thêm kỹ năng'),
        vocab: `
            <div class="vocab-section">
                <div class="idea-cards">
                    ${generateVocabItem('01', 'Making friends', [
                        'when living in a dormitory, students share rooms and common spaces with others',
                        'talk, study, and spend time together every day'
                    ])}
                    ${generateVocabItem('02', 'Nearby classes', [
                        'located inside the campus',
                        'don’t need to travel far',
                        'save time and energy'
                    ])}
                    ${generateVocabItem('03', 'Learning more skills', [
                        'take care of themselves, such as cleaning their room, managing time, and solving problems',
                        'become more independent and responsible'
                    ])}
                </div>
            </div>
        `,
        sample: [
            {
                en: "Today, I'd like to talk about staying in a dormitory.",
                vn: "Hôm nay, tôi muốn nói về việc ở ký túc xá."
            },
            {
                en: "Firstly, students can make more friends. This is because when living in a dormitory, students share rooms and common spaces with others. They can talk, study, and spend time together every day.",
                vn: "Đầu tiên, sinh viên có thể kết bạn nhiều hơn. Điều này là do khi sống ở ký túc xá, sinh viên ở chung phòng và không gian chung với người khác. Họ có thể nói chuyện, học tập và dành thời gian cùng nhau mỗi ngày."
            },
            {
                en: "Moreover, staying in a dormitory is very convenient for studying. Most dormitories are located inside the campus, so students don’t need to travel far. This helps them save time and energy.",
                vn: "Hơn nữa, ở ký túc xá rất thuận tiện cho việc học. Hầu hết các ký túc xá nằm trong khuôn viên trường, vì vậy sinh viên không cần phải đi xa. Điều này giúp họ tiết kiệm thời gian và sức lực."
            },
            {
                en: "Finally, living in a dormitory helps students learn many important life skills. They need to take care of themselves, such as cleaning their room, managing time, and solving problems. Therefore, students become more independent and responsible.",
                vn: "Cuối cùng, sống ở ký túc xá giúp sinh viên học được nhiều kỹ năng sống quan trọng. Họ cần tự chăm sóc bản thân, chẳng hạn như dọn dẹp phòng, quản lý thời gian và giải quyết vấn đề. Do đó, sinh viên trở nên tự lập và có trách nhiệm hơn."
            },
            {
                en: "To sum up, it’s true that staying in a dormitory offers many benefits for students.",
                vn: "Tóm lại, đúng là ở ký túc xá mang lại nhiều lợi ích cho sinh viên."
            }
        ]
    },
    {
        id: "test5",
        title: "Topic 05 🏙️",
        topic: "Living in an apartment has some disadvantages.",
        promptEn: `<strong>Topic:</strong> Living in an apartment has some disadvantages.<br>` +
            generateMindmap('Living in an apartment', 'Pet restriction', 'Small space', 'your own ideas', 'Noise from neighbor'),
        promptVn: `<strong>Chủ đề:</strong> Sống trong căn hộ có một số nhược điểm.<br>` +
            generateMindmap('Sống trong căn hộ', 'Hạn chế thú cưng', 'Không gian nhỏ', 'ý tưởng của bạn', 'Tiếng ồn từ hàng xóm'),
        vocab: `
            <div class="vocab-section">
                <div class="idea-cards">
                    ${generateVocabItem('01', 'Small space', [
                        'most apartments are not very large, especially in big cities',
                        'may not have enough room for all their furniture or personal things',
                        'feel uncomfortable and crowded'
                    ])}
                    ${generateVocabItem('02', 'Pet restriction', [
                        'do not allow pets, or they only allow small animals',
                        'problem for people who love animals',
                        'cannot enjoy having a pet at home'
                    ])}
                    ${generateVocabItem('03', 'Noise from neighbor', [
                        'live very close to each other',
                        'easy to hear sounds from next door',
                        'play loud music, talk loudly, or move furniture at night',
                        'difficult to relax or sleep well'
                    ])}
                </div>
            </div>
        `,
        sample: [
            {
                en: "Today, I'd like to talk about living in an apartment.",
                vn: "Hôm nay, tôi muốn nói về việc sống trong căn hộ."
            },
            {
                en: "Firstly, one disadvantage of living in an apartment is small space. This is because most apartments are not very large, especially in big cities. People may not have enough room for all their furniture or personal things. Therefore, it can feel uncomfortable and crowded.",
                vn: "Đầu tiên, một nhược điểm của việc sống trong căn hộ là không gian nhỏ. Điều này là do hầu hết các căn hộ không lớn lắm, đặc biệt là ở các thành phố lớn. Mọi người có thể không có đủ chỗ cho tất cả đồ đạc hoặc vật dụng cá nhân của họ. Do đó, nó có thể cảm thấy không thoải mái và chật chội."
            },
            {
                en: "Moreover, another problem is pet restriction. Many apartment buildings do not allow pets, or they only allow small animals. This can be a problem for people who love animals. As a result, they cannot enjoy having a pet at home.",
                vn: "Hơn nữa, một vấn đề khác là hạn chế thú cưng. Nhiều tòa nhà chung cư không cho phép nuôi thú cưng, hoặc họ chỉ cho phép những động vật nhỏ. Đây có thể là một vấn đề đối với những người yêu động vật. Kết quả là, họ không thể tận hưởng việc có một thú cưng ở nhà."
            },
            {
                en: "Finally, noise from neighbors can be a major issue. In an apartment, people live very close to each other, so it is easy to hear sounds from next door. For example, neighbors may play loud music, talk loudly, or move furniture at night. Therefore, it can be difficult to relax or sleep well.",
                vn: "Cuối cùng, tiếng ồn từ hàng xóm có thể là một vấn đề lớn. Trong một căn hộ, mọi người sống rất gần nhau, vì vậy rất dễ nghe thấy âm thanh từ nhà bên cạnh. Ví dụ, hàng xóm có thể mở nhạc lớn, nói chuyện lớn tiếng hoặc di chuyển đồ đạc vào ban đêm. Do đó, có thể khó thư giãn hoặc ngủ ngon."
            },
            {
                en: "To sum up, it’s true that living in an apartment has several disadvantages.",
                vn: "Tóm lại, đúng là sống trong căn hộ có một số nhược điểm."
            }
        ]
    },
    {
        id: "test6",
        title: "Topic 06 🤝",
        topic: "Teamwork plays an important role in young people’s lives.",
        promptEn: `<strong>Topic:</strong> Teamwork plays an important role in young people’s lives.<br>` +
            generateMindmap('Teamwork', 'Leadership', 'Cooperation', 'your own ideas', 'Effective work'),
        promptVn: `<strong>Chủ đề:</strong> Làm việc nhóm đóng vai trò quan trọng trong cuộc sống của người trẻ.<br>` +
            generateMindmap('Làm việc nhóm', 'Lãnh đạo', 'Sự hợp tác', 'ý tưởng của bạn', 'Công việc hiệu quả'),
        vocab: `
            <div class="vocab-section">
                <div class="idea-cards">
                    ${generateVocabItem('01', 'Cooperation', [
                        'everyone needs to share ideas and support each other',
                        'learn how to listen and work well with others'
                    ])}
                    ${generateVocabItem('02', 'Leadership', [
                        'one person may become the leader and guide the team',
                        'learns how to organize work and make decisions'
                    ])}
                    ${generateVocabItem('03', 'Effective work', [
                        'complete tasks faster and better',
                        'focus on what they are good at',
                        'one student can do research, while another designs slides for a presentation'
                    ])}
                </div>
            </div>
        `,
        sample: [
            {
                en: "Today, I'd like to talk about teamwork.",
                vn: "Hôm nay, tôi muốn nói về làm việc nhóm."
            },
            {
                en: "Firstly, teamwork helps young people learn how to cooperate with others. This is because when working in a team, everyone needs to share ideas and support each other. Therefore, they learn how to listen and work well with others.",
                vn: "Đầu tiên, làm việc nhóm giúp người trẻ học cách hợp tác với người khác. Điều này là do khi làm việc trong một nhóm, mọi người cần chia sẻ ý tưởng và hỗ trợ lẫn nhau. Do đó, họ học được cách lắng nghe và làm việc tốt với người khác."
            },
            {
                en: "Moreover, teamwork helps develop leadership skills. When working in a group, one person may become the leader and guide the team. This person learns how to organize work and make decisions.",
                vn: "Hơn nữa, làm việc nhóm giúp phát triển kỹ năng lãnh đạo. Khi làm việc trong một nhóm, một người có thể trở thành người lãnh đạo và hướng dẫn nhóm. Người này học được cách tổ chức công việc và đưa ra quyết định."
            },
            {
                en: "Finally, teamwork makes work more effective. When many people work together, they can complete tasks faster and better. Each person can focus on what they are good at. For example, one student can do research, while another designs slides for a presentation.",
                vn: "Cuối cùng, làm việc nhóm làm cho công việc hiệu quả hơn. Khi nhiều người làm việc cùng nhau, họ có thể hoàn thành nhiệm vụ nhanh hơn và tốt hơn. Mỗi người có thể tập trung vào những gì họ giỏi. Ví dụ, một sinh viên có thể làm nghiên cứu, trong khi một sinh viên khác thiết kế slide cho bài thuyết trình."
            },
            {
                en: "To sum up, it’s true that teamwork plays an important role in young people’s lives.",
                vn: "Tóm lại, đúng là làm việc nhóm đóng một vai trò quan trọng trong cuộc sống của người trẻ."
            }
        ]
    },
    {
        id: "test7",
        title: "Topic 07 💼",
        topic: "There are several factors to consider when applying for a job.",
        promptEn: `<strong>Topic:</strong> There are several factors to consider when applying for a job.<br>` +
            generateMindmap('Applying for a job', 'Salary', 'Location', 'your own ideas', 'Working environment'),
        promptVn: `<strong>Chủ đề:</strong> Có một số yếu tố cần xem xét khi nộp đơn xin việc.<br>` +
            generateMindmap('Nộp đơn xin việc', 'Tiền lương', 'Vị trí', 'ý tưởng của bạn', 'Môi trường làm việc'),
        vocab: `
            <div class="vocab-section">
                <div class="idea-cards">
                    ${generateVocabItem('01', 'Salary', [
                        'need money to pay for their daily expenses such as food, rent, and transportation',
                        'live more comfortably'
                    ])}
                    ${generateVocabItem('02', 'Location', [
                        'workplace is too far from home',
                        'spend a lot of time traveling',
                        'travel two hours every day to go to work',
                        'very tiring'
                    ])}
                    ${generateVocabItem('03', 'Working environment', [
                        'make people feel comfortable and motivated',
                        'friendly colleagues, supportive managers, and a safe workplace'
                    ])}
                </div>
            </div>
        `,
        sample: [
            {
                en: "Today, I'd like to talk about applying for a job.",
                vn: "Hôm nay, tôi muốn nói về việc nộp đơn xin việc."
            },
            {
                en: "Firstly, one important factor when applying for a job is salary. This is because people need money to pay for their daily expenses such as food, rent, and transportation. A good salary can help them live more comfortably.",
                vn: "Đầu tiên, một yếu tố quan trọng khi nộp đơn xin việc là tiền lương. Điều này là do mọi người cần tiền để chi trả cho các chi phí sinh hoạt hàng ngày như thức ăn, tiền thuê nhà và đi lại. Một mức lương tốt có thể giúp họ sống thoải mái hơn."
            },
            {
                en: "Moreover, another important factor is location. If the workplace is too far from home, they may spend a lot of time traveling. For instance, someone may need to travel two hours every day to go to work, which can be very tiring.",
                vn: "Hơn nữa, một yếu tố quan trọng khác là vị trí. Nếu nơi làm việc quá xa nhà, họ có thể dành nhiều thời gian để đi lại. Ví dụ, một người nào đó có thể cần đi lại hai giờ mỗi ngày để đi làm, điều này có thể rất mệt mỏi."
            },
            {
                en: "Finally, the working environment also plays an important role. A good working environment can make people feel comfortable and motivated. This includes friendly colleagues, supportive managers, and a safe workplace.",
                vn: "Cuối cùng, môi trường làm việc cũng đóng một vai trò quan trọng. Một môi trường làm việc tốt có thể làm cho mọi người cảm thấy thoải mái và có động lực. Điều này bao gồm những đồng nghiệp thân thiện, những người quản lý luôn hỗ trợ và một nơi làm việc an toàn."
            },
            {
                en: "To sum up, it’s true that there are several important factors to consider when applying for a job.",
                vn: "Tóm lại, đúng là có một số yếu tố quan trọng cần xem xét khi nộp đơn xin việc."
            }
        ]
    },
    {
        id: "test8",
        title: "Topic 08 📱",
        topic: "E-books are becoming increasingly popular in today’s modern society.",
        promptEn: `<strong>Topic:</strong> E-books are becoming increasingly popular in today’s modern society.<br>` +
            generateMindmap('E-books', 'easy access', 'convenient', 'your own ideas', 'knowledge'),
        promptVn: `<strong>Chủ đề:</strong> Sách điện tử đang ngày càng trở nên phổ biến trong xã hội hiện đại ngày nay.<br>` +
            generateMindmap('Sách điện tử', 'dễ dàng truy cập', 'tiện lợi', 'ý tưởng của bạn', 'kiến thức'),
        vocab: `
            <div class="vocab-section">
                <div class="idea-cards">
                    ${generateVocabItem('01', 'Convenient', [
                        'read them anytime and anywhere using their phones, tablets, or laptops',
                        'do not need to carry heavy books',
                        'make reading much easier and more flexible'
                    ])}
                    ${generateVocabItem('02', 'Easy access', [
                        'download books from the Internet in just a few minutes',
                        'search for specific information quickly'
                    ])}
                    ${generateVocabItem('03', 'Knowledge', [
                        'many different types of e-books, such as textbooks, novels, and self-help books',
                        'learn many new things',
                        'read an e-book about learning English or improving skills'
                    ])}
                </div>
            </div>
        `,
        sample: [
            {
                en: "Today, I'd like to talk about e-books.",
                vn: "Hôm nay, tôi muốn nói về sách điện tử."
            },
            {
                en: "Firstly, e-books are very convenient. This is because people can read them anytime and anywhere using their phones, tablets, or laptops. They do not need to carry heavy books. Therefore, e-books make reading much easier and more flexible.",
                vn: "Đầu tiên, sách điện tử rất tiện lợi. Điều này là do mọi người có thể đọc chúng bất cứ lúc nào và ở đâu bằng điện thoại, máy tính bảng hoặc máy tính xách tay. Họ không cần phải mang theo những cuốn sách nặng. Do đó, sách điện tử làm cho việc đọc trở nên dễ dàng và linh hoạt hơn nhiều."
            },
            {
                en: "Moreover, e-books provide easy access to information. People can download books from the Internet in just a few minutes. They can also search for specific information quickly.",
                vn: "Hơn nữa, sách điện tử cung cấp sự truy cập dễ dàng vào thông tin. Mọi người có thể tải sách từ Internet chỉ trong vài phút. Họ cũng có thể tìm kiếm thông tin cụ thể một cách nhanh chóng."
            },
            {
                en: "Finally, e-books help people gain more knowledge. There are many different types of e-books, such as textbooks, novels, and self-help books. This allows readers to learn many new things. For example, someone can read an e-book about learning English or improving skills.",
                vn: "Cuối cùng, sách điện tử giúp mọi người có thêm kiến thức. Có rất nhiều loại sách điện tử khác nhau, chẳng hạn như sách giáo khoa, tiểu thuyết và sách phát triển bản thân. Điều này cho phép người đọc học nhiều điều mới. Ví dụ, một người nào đó có thể đọc một cuốn sách điện tử về việc học tiếng Anh hoặc cải thiện kỹ năng."
            },
            {
                en: "To sum up, it’s true that e-books are becoming increasingly popular in today’s modern society.",
                vn: "Tóm lại, đúng là sách điện tử đang ngày càng trở nên phổ biến trong xã hội hiện đại ngày nay."
            }
        ]
    },
    {
        id: "test9",
        title: "Topic 09 ⭐",
        topic: "Responsibility plays an important role in personal and social development.",
        promptEn: `<strong>Topic:</strong> Responsibility plays an important role in personal and social development.<br>` +
            generateMindmap('Responsibility', 'achieve high results', 'gain trust from others', 'your own ideas', 'improve teamwork skills'),
        promptVn: `<strong>Chủ đề:</strong> Trách nhiệm đóng một vai trò quan trọng trong sự phát triển cá nhân và xã hội.<br>` +
            generateMindmap('Trách nhiệm', 'đạt kết quả cao', 'nhận được sự tin tưởng từ người khác', 'ý tưởng của bạn', 'cải thiện kỹ năng làm việc nhóm'),
        vocab: `
            <div class="vocab-section">
                <div class="idea-cards">
                    ${generateVocabItem('01', 'Achieve high results', [
                        'try to complete their tasks carefully and on time',
                        'take their work seriously and do their best',
                        'get good grades and better results'
                    ])}
                    ${generateVocabItem('02', 'Gain trust from others', [
                        'keeps their promises and does their duties well',
                        'others will believe in them',
                        'have more opportunities in study and work'
                    ])}
                    ${generateVocabItem('03', 'Improve teamwork skills', [
                        'each member in a team is responsible',
                        'work becomes easier and more effective',
                        'does their part and supports each other',
                        'helps teams work better together'
                    ])}
                </div>
            </div>
        `,
        sample: [
            {
                en: "Today, I'd like to talk about responsibility.",
                vn: "Hôm nay, tôi muốn nói về trách nhiệm."
            },
            {
                en: "Firstly, responsibility helps people achieve high results. This is because responsible people always try to complete their tasks carefully and on time. They take their work seriously and do their best. Therefore, they often get good grades and better results.",
                vn: "Đầu tiên, trách nhiệm giúp mọi người đạt kết quả cao. Điều này là do những người có trách nhiệm luôn cố gắng hoàn thành nhiệm vụ của họ một cách cẩn thận và đúng hạn. Họ coi trọng công việc và làm hết sức mình. Do đó, họ thường đạt điểm cao và kết quả tốt hơn."
            },
            {
                en: "Moreover, responsibility helps people gain trust from others. When someone always keeps their promises and does their duties well, others will believe in them. As a result, that person can have more opportunities in study and work.",
                vn: "Hơn nữa, trách nhiệm giúp mọi người nhận được sự tin tưởng từ người khác. Khi một người luôn giữ lời hứa và làm tốt nhiệm vụ của mình, những người khác sẽ tin tưởng họ. Kết quả là, người đó có thể có nhiều cơ hội hơn trong học tập và công việc."
            },
            {
                en: "Finally, responsibility can improve teamwork skills. When each member in a team is responsible, the work becomes easier and more effective. Everyone does their part and supports each other. Therefore, responsibility helps teams work better together.",
                vn: "Cuối cùng, trách nhiệm có thể cải thiện kỹ năng làm việc nhóm. Khi mỗi thành viên trong một nhóm đều có trách nhiệm, công việc trở nên dễ dàng và hiệu quả hơn. Mọi người làm phần việc của mình và hỗ trợ lẫn nhau. Do đó, trách nhiệm giúp các nhóm làm việc cùng nhau tốt hơn."
            },
            {
                en: "To sum up, it’s true that responsibility plays an important role in personal and social development.",
                vn: "Tóm lại, đúng là trách nhiệm đóng một vai trò quan trọng trong sự phát triển cá nhân và xã hội."
            }
        ]
    },
    {
        id: "test10",
        title: "Topic 10 🏋️",
        topic: "Although doing exercise is generally beneficial, there are still several disadvantages.",
        promptEn: `<strong>Topic:</strong> Although doing exercise is generally beneficial, there are still several disadvantages.<br>` +
            generateMindmap('Doing exercise', 'time-consuming', 'expensive', 'your own ideas', 'the risk of injuries'),
        promptVn: `<strong>Chủ đề:</strong> Mặc dù tập thể dục nói chung là có lợi, vẫn có một số nhược điểm.<br>` +
            generateMindmap('Tập thể dục', 'tốn thời gian', 'đắt đỏ', 'ý tưởng của bạn', 'nguy cơ chấn thương'),
        vocab: `
            <div class="vocab-section">
                <div class="idea-cards">
                    ${generateVocabItem('01', 'Time-consuming', [
                        'spend a certain amount of time every day practicing regularly',
                        'difficult to balance exercise with their daily schedule'
                    ])}
                    ${generateVocabItem('02', 'Expensive', [
                        'money for equipment, gym memberships, or training classes',
                        'pay monthly fees to go to the gym or buy sports clothes and shoes'
                    ])}
                    ${generateVocabItem('03', 'The risk of injuries', [
                        'do not exercise properly or push themselves too hard, they can get hurt',
                        'hurt their muscles or joints while lifting heavy weights or playing sports'
                    ])}
                </div>
            </div>
        `,
        sample: [
            {
                en: "Today, I'd like to talk about doing exercise.",
                vn: "Hôm nay, tôi muốn nói về việc tập thể dục."
            },
            {
                en: "Firstly, doing exercise can be time-consuming. This is because people need to spend a certain amount of time every day practicing regularly. Therefore, some people find it difficult to balance exercise with their daily schedule.",
                vn: "Đầu tiên, tập thể dục có thể tốn thời gian. Điều này là do mọi người cần dành một khoảng thời gian nhất định mỗi ngày để tập luyện thường xuyên. Do đó, một số người thấy khó khăn trong việc cân bằng việc tập thể dục với lịch trình hàng ngày của họ."
            },
            {
                en: "Moreover, doing exercise can be expensive. Some activities require money for equipment, gym memberships, or training classes. For example, people may need to pay monthly fees to go to the gym or buy sports clothes and shoes.",
                vn: "Hơn nữa, tập thể dục có thể đắt đỏ. Một số hoạt động đòi hỏi tiền cho thiết bị, thẻ thành viên phòng tập, hoặc các lớp huấn luyện. Ví dụ, mọi người có thể cần phải trả phí hàng tháng để đến phòng tập hoặc mua quần áo và giày thể thao."
            },
            {
                en: "Finally, there is a risk of injuries when doing exercise. If people do not exercise properly or push themselves too hard, they can get hurt. For example, someone may hurt their muscles or joints while lifting heavy weights or playing sports.",
                vn: "Cuối cùng, có nguy cơ chấn thương khi tập thể dục. Nếu mọi người không tập thể dục đúng cách hoặc ép bản thân quá mức, họ có thể bị thương. Ví dụ, một người nào đó có thể làm tổn thương cơ hoặc khớp của họ trong khi nâng tạ nặng hoặc chơi thể thao."
            },
            {
                en: "To sum up, although doing exercise is beneficial, it still has several disadvantages.",
                vn: "Tóm lại, mặc dù tập thể dục có lợi, nó vẫn có một số nhược điểm."
            }
        ]
    },
    {
        id: "test11",
        title: "Topic 11 👩",
        topic: "Women should be encouraged to become leaders.",
        promptEn: `<strong>Topic:</strong> Women should be encouraged to become leaders.<br>` +
            generateMindmap('Women', 'good communication', 'careful decision making', 'your own ideas', 'multitasking skills'),
        promptVn: `<strong>Chủ đề:</strong> Phụ nữ nên được khuyến khích trở thành những nhà lãnh đạo.<br>` +
            generateMindmap('Phụ nữ', 'giao tiếp tốt', 'ra quyết định cẩn thận', 'ý tưởng của bạn', 'kỹ năng đa nhiệm'),
        vocab: `
            <div class="vocab-section">
                <div class="idea-cards">
                    ${generateVocabItem('01', 'Good communication', [
                        'good at listening and expressing their ideas clearly',
                        'understand others’ feelings and build strong relationships'
                    ])}
                    ${generateVocabItem('02', 'Careful decision making', [
                        'think carefully before making a decision and consider different points of view',
                        'avoid mistakes'
                    ])}
                    ${generateVocabItem('03', 'Multitasking skills', [
                        'manage many tasks at the same time and still do them well',
                        'handle work responsibilities while also taking care of her family',
                        'manage different duties effectively'
                    ])}
                </div>
            </div>
        `,
        sample: [
            {
                en: "Today, I'd like to talk about the reasons why women should become leaders.",
                vn: "Hôm nay, tôi muốn nói về những lý do tại sao phụ nữ nên trở thành những nhà lãnh đạo."
            },
            {
                en: "Firstly, women often have good communication skills. This is because they are usually good at listening and expressing their ideas clearly. They can understand others’ feelings and build strong relationships.",
                vn: "Đầu tiên, phụ nữ thường có kỹ năng giao tiếp tốt. Điều này là do họ thường giỏi lắng nghe và bày tỏ ý tưởng của mình một cách rõ ràng. Họ có thể hiểu cảm xúc của người khác và xây dựng các mối quan hệ bền chặt."
            },
            {
                en: "Moreover, women are good at careful decision making. They often think carefully before making a decision and consider different points of view. This helps avoid mistakes.",
                vn: "Hơn nữa, phụ nữ giỏi trong việc ra quyết định cẩn thận. Họ thường suy nghĩ cẩn thận trước khi đưa ra quyết định và xem xét các quan điểm khác nhau. Điều này giúp tránh những sai lầm."
            },
            {
                en: "Finally, women usually have strong multitasking skills. They can manage many tasks at the same time and still do them well. For example, a woman may handle work responsibilities while also taking care of her family. Therefore, she can manage different duties effectively.",
                vn: "Cuối cùng, phụ nữ thường có kỹ năng đa nhiệm mạnh mẽ. Họ có thể quản lý nhiều công việc cùng lúc và vẫn làm tốt chúng. Ví dụ, một người phụ nữ có thể xử lý các trách nhiệm công việc trong khi cũng chăm sóc gia đình của cô ấy. Do đó, cô ấy có thể quản lý các nhiệm vụ khác nhau một cách hiệu quả."
            },
            {
                en: "To sum up, it’s clear that women should be encouraged to become leaders.",
                vn: "Tóm lại, rõ ràng là phụ nữ nên được khuyến khích trở thành những nhà lãnh đạo."
            }
        ]
    },
    {
        id: "test12",
        title: "Topic 12 💔",
        topic: "There are several reasons for divorce.",
        promptEn: `<strong>Topic:</strong> There are several reasons for divorce.<br>` +
            generateMindmap('Divorce', 'lack of responsibility', 'financial burden', 'your own ideas', 'communication problems'),
        promptVn: `<strong>Chủ đề:</strong> Có một vài lý do dẫn đến ly hôn.<br>` +
            generateMindmap('Ly hôn', 'thiếu trách nhiệm', 'gánh nặng tài chính', 'ý tưởng của bạn', 'vấn đề giao tiếp'),
        vocab: `
            <div class="vocab-section">
                <div class="idea-cards">
                    ${generateVocabItem('01', 'Lack of responsibility', [
                        'one or both partners do not take care of their duties',
                        'problems can happen',
                        'not support each other or take care of the family'
                    ])}
                    ${generateVocabItem('02', 'Financial burden', [
                        'Money problems can create a lot of pressure in a marriage',
                        'does not have enough money or spends too much, they may argue frequently',
                        'financial stress can damage the relationship'
                    ])}
                    ${generateVocabItem('03', 'Communication problems', [
                        'do not talk openly or do not understand each other',
                        'conflicts can happen',
                        'relationship becomes weaker over time and may end in divorce'
                    ])}
                </div>
            </div>
        `,
        sample: [
            {
                en: "Today, I'd like to talk about divorce.",
                vn: "Hôm nay, tôi muốn nói về ly hôn."
            },
            {
                en: "Firstly, one main reason for divorce is a lack of responsibility. This is because when one or both partners do not take care of their duties, problems can happen. They may not support each other or take care of the family.",
                vn: "Đầu tiên, một lý do chính dẫn đến ly hôn là sự thiếu trách nhiệm. Điều này là do khi một hoặc cả hai đối tác không chăm lo cho nhiệm vụ của họ, các vấn đề có thể xảy ra. Họ có thể không hỗ trợ lẫn nhau hoặc chăm sóc gia đình."
            },
            {
                en: "Moreover, another common cause is financial burden. Money problems can create a lot of pressure in a marriage. If a couple does not have enough money or spends too much, they may argue frequently. As a result, financial stress can damage the relationship.",
                vn: "Hơn nữa, một nguyên nhân phổ biến khác là gánh nặng tài chính. Các vấn đề về tiền bạc có thể tạo ra nhiều áp lực trong một cuộc hôn nhân. Nếu một cặp vợ chồng không có đủ tiền hoặc chi tiêu quá nhiều, họ có thể tranh cãi thường xuyên. Kết quả là, căng thẳng tài chính có thể làm hỏng mối quan hệ."
            },
            {
                en: "Finally, communication problems can also lead to divorce. When couples do not talk openly or do not understand each other, conflicts can happen. Therefore, the relationship becomes weaker over time and may end in divorce.",
                vn: "Cuối cùng, các vấn đề về giao tiếp cũng có thể dẫn đến ly hôn. Khi các cặp vợ chồng không nói chuyện cởi mở hoặc không hiểu nhau, các xung đột có thể xảy ra. Do đó, mối quan hệ trở nên yếu đi theo thời gian và có thể kết thúc bằng việc ly hôn."
            },
            {
                en: "To sum up, it’s true that there are several reasons for divorce.",
                vn: "Tóm lại, đúng là có một vài lý do dẫn đến ly hôn."
            }
        ]
    },
    {
        id: "test13",
        title: "Topic 13 👔",
        topic: "There are several factors to consider in order to make a good impression in an interview.",
        promptEn: `<strong>Topic:</strong> There are several factors to consider in order to make a good impression in an interview.<br>` +
            generateMindmap('Job interviews', 'preparation', 'communication skills', 'your own ideas', 'appearance'),
        promptVn: `<strong>Chủ đề:</strong> Có một số yếu tố cần xem xét để tạo ấn tượng tốt trong một cuộc phỏng vấn.<br>` +
            generateMindmap('Phỏng vấn xin việc', 'sự chuẩn bị', 'kỹ năng giao tiếp', 'ý tưởng của bạn', 'ngoại hình'),
        vocab: `
            <div class="vocab-section">
                <div class="idea-cards">
                    ${generateVocabItem('01', 'Preparation', [
                        'understand the job and the company before the interview',
                        'prepare answers for common questions'
                    ])}
                    ${generateVocabItem('02', 'Communication skills', [
                        'express their ideas clearly and confidently',
                        'speak politely and listen carefully to the interviewer'
                    ])}
                    ${generateVocabItem('03', 'Appearance', [
                        'wearing clean and formal clothes shows respect and a professional attitude',
                        'increase the chances of success in an interview'
                    ])}
                </div>
            </div>
        `,
        sample: [
            {
                en: "Today, I'd like to talk about job interviews.",
                vn: "Hôm nay, tôi muốn nói về các cuộc phỏng vấn xin việc."
            },
            {
                en: "Firstly, one factor to have a successful interview is preparation. This is because candidates need to understand the job and the company before the interview. They should also prepare answers for common questions.",
                vn: "Đầu tiên, một yếu tố để có một cuộc phỏng vấn thành công là sự chuẩn bị. Điều này là do các ứng viên cần hiểu công việc và công ty trước cuộc phỏng vấn. Họ cũng nên chuẩn bị câu trả lời cho các câu hỏi phổ biến."
            },
            {
                en: "Moreover, another important factor is communication skills. During the interview, candidates need to express their ideas clearly and confidently. They should speak politely and listen carefully to the interviewer.",
                vn: "Hơn nữa, một yếu tố quan trọng khác là kỹ năng giao tiếp. Trong quá trình phỏng vấn, các ứng viên cần bày tỏ ý tưởng của họ một cách rõ ràng và tự tin. Họ nên nói năng lịch sự và lắng nghe cẩn thận người phỏng vấn."
            },
            {
                en: "Finally, appearance also plays an important role. For example, wearing clean and formal clothes shows respect and a professional attitude. Therefore, a good appearance can increase the chances of success in an interview.",
                vn: "Cuối cùng, ngoại hình cũng đóng một vai trò quan trọng. Ví dụ, mặc quần áo sạch sẽ và trang trọng thể hiện sự tôn trọng và thái độ chuyên nghiệp. Do đó, một ngoại hình tốt có thể tăng cơ hội thành công trong một cuộc phỏng vấn."
            },
            {
                en: "To sum up, it’s true that there are several factors to consider in order to make a good impression in an interview.",
                vn: "Tóm lại, đúng là có một số yếu tố cần xem xét để tạo ấn tượng tốt trong một cuộc phỏng vấn."
            }
        ]
    },
    {
        id: "test14",
        title: "Topic 14 🌳",
        topic: "Trees bring many benefits to people and the environment.",
        promptEn: `<strong>Topic:</strong> Trees bring many benefits to people and the environment.<br>` +
            generateMindmap('Benefits of trees', 'Food', 'Flood prevention', 'your own ideas', 'Environmental protection'),
        promptVn: `<strong>Chủ đề:</strong> Cây cối mang lại nhiều lợi ích cho con người và môi trường.<br>` +
            generateMindmap('Lợi ích của cây cối', 'Thức ăn', 'Ngăn ngừa lũ lụt', 'ý tưởng của bạn', 'Bảo vệ môi trường'),
        vocab: `
            <div class="vocab-section">
                <div class="idea-cards">
                    ${generateVocabItem('01', 'Food', [
                        { en: 'give us fruits, nuts, and leaves', vn: 'cho chúng ta trái cây, hạt, và lá' },
                        { en: 'Ex: mango trees + coconut trees + banana trees => very useful', vn: 'VD: cây xoài + cây dừa + cây chuối => rất hữu ích' }
                    ])}
                    ${generateVocabItem('02', 'Environmental protection', [
                        { en: 'absorb carbon dioxide + release oxygen => make the air cleaner; reduce air pollution', vn: 'hấp thụ khí carbon dioxide + thải ra oxy => làm cho không khí sạch hơn; giảm ô nhiễm không khí' },
                        { en: 'provide shade + make the weather cooler', vn: 'cung cấp bóng râm + làm cho thời tiết mát mẻ hơn' }
                    ])}
                    ${generateVocabItem('03', 'Flood prevention', [
                        { en: 'roots => hold the soil + absorb rainwater', vn: 'rễ cây => giữ đất + hấp thụ nước mưa' },
                        { en: 'many trees => water does not flow too quickly => prevent flood', vn: 'nhiều cây => nước không chảy quá nhanh => ngăn ngừa lũ lụt' }
                    ])}
                </div>
            </div>
        `,
        sample: [
            {
                en: "Today, I'd like to talk about the benefits of trees.",
                vn: "Hôm nay, tôi muốn nói về những lợi ích của cây cối."
            },
            {
                en: "Firstly, trees can provide food for people and animals. This is because many trees give us fruits, nuts, and leaves that we can eat. For example, mango trees, coconut trees, and banana trees are very useful in daily life.",
                vn: "Đầu tiên, cây cối có thể cung cấp thức ăn cho con người và động vật. Điều này là do nhiều loại cây cho chúng ta trái cây, hạt và lá mà chúng ta có thể ăn được. Ví dụ, cây xoài, cây dừa và cây chuối rất hữu ích trong cuộc sống hàng ngày."
            },
            {
                en: "Moreover, trees help protect the environment. They can make the air cleaner because they absorb carbon dioxide and release oxygen. Trees also provide shade and make the weather cooler, especially in big cities.",
                vn: "Hơn nữa, cây cối giúp bảo vệ môi trường. Chúng có thể làm cho không khí sạch hơn vì chúng hấp thụ khí carbon dioxide và thải ra oxy. Cây cối cũng cung cấp bóng râm và làm cho thời tiết mát mẻ hơn, đặc biệt là ở các thành phố lớn."
            },
            {
                en: "Finally, trees can help prevent floods. Their roots can hold the soil and absorb rainwater. When there are many trees, water does not flow too quickly, so floods can be reduced.",
                vn: "Cuối cùng, cây cối có thể giúp ngăn ngừa lũ lụt. Rễ của chúng có thể giữ đất và hấp thụ nước mưa. Khi có nhiều cây, nước không chảy quá nhanh, do đó lũ lụt có thể được giảm bớt."
            },
            {
                en: "To sum up, it’s true that trees bring many benefits to our life.",
                vn: "Tóm lại, đúng là cây cối mang lại nhiều lợi ích cho cuộc sống của chúng ta."
            }
        ]
    },
    {
        id: "test15",
        title: "Topic 15 ⚡",
        topic: "Electric cars bring many benefits to people and the environment.",
        promptEn: `<strong>Topic:</strong> Electric cars bring many benefits to people and the environment.<br>` +
            generateMindmap('Electric cars', 'Reduce pollution', 'Save money', 'your own ideas', 'Save natural resources'),
        promptVn: `<strong>Chủ đề:</strong> Xe điện mang lại nhiều lợi ích cho con người và môi trường.<br>` +
            generateMindmap('Xe điện', 'Giảm ô nhiễm', 'Tiết kiệm tiền', 'ý tưởng của bạn', 'Tiết kiệm tài nguyên thiên nhiên'),
        vocab: `
            <div class="vocab-section">
                <div class="idea-cards">
                    ${generateVocabItem('01', 'Reduce pollution', [
                        { en: '(not) produce smoke + harmful emissions => the air => cleaner (especially in big cities)', vn: '(không) tạo ra khói + khí thải độc hại => không khí => sạch hơn (đặc biệt là ở các thành phố lớn)' }
                    ])}
                    ${generateVocabItem('02', 'Save natural resources', [
                        { en: 'cars and motorbikes => use gas as fuel (limited + may run out)', vn: 'ô tô và xe máy => sử dụng xăng làm nhiên liệu (có hạn + có thể cạn kiệt)' },
                        { en: 'electric cars => use electricity => reduce the need for fossil fuels => more sustainable in the long term', vn: 'xe điện => sử dụng điện => giảm nhu cầu về nhiên liệu hóa thạch => bền vững hơn về lâu dài' }
                    ])}
                    ${generateVocabItem('03', 'Save money', [
                        { en: '(not) pay for fuel, which is becoming increasingly expensive nowadays', vn: '(không) trả tiền cho nhiên liệu, thứ đang ngày càng trở nên đắt đỏ hiện nay' },
                        { en: 'expensive at first => cheaper to use in the long term', vn: 'đắt đỏ lúc đầu => rẻ hơn khi sử dụng về lâu dài' }
                    ])}
                </div>
            </div>
        `,
        sample: [
            {
                en: "Today, I'd like to talk about the benefits of electric cars.",
                vn: "Hôm nay, tôi muốn nói về lợi ích của xe điện."
            },
            {
                en: "Firstly, electric cars can help reduce pollution. This is because they do not produce smoke or harmful emissions like cars or motorbikes. As a result, the air becomes cleaner, especially in big cities where there is a lot of traffic.",
                vn: "Đầu tiên, xe điện có thể giúp giảm ô nhiễm. Điều này là do chúng không tạo ra khói hoặc khí thải độc hại như ô tô hay xe máy. Kết quả là, không khí trở nên sạch hơn, đặc biệt là ở các thành phố lớn nơi có nhiều phương tiện giao thông."
            },
            {
                en: "Moreover, electric cars can help save natural resources. In fact, cars or motorbikes use gas as fuel, which is limited and may run out in the future. Electric cars use electricity, so they can reduce our need for fossil fuels. Therefore, they are more sustainable in the long term.",
                vn: "Hơn nữa, xe điện có thể giúp tiết kiệm tài nguyên thiên nhiên. Trên thực tế, ô tô hoặc xe máy sử dụng xăng làm nhiên liệu, thứ bị giới hạn và có thể cạn kiệt trong tương lai. Xe điện sử dụng điện, vì vậy chúng có thể giảm nhu cầu của chúng ta về nhiên liệu hóa thạch. Do đó, chúng bền vững hơn về lâu dài."
            },
            {
                en: "Finally, electric cars can help people save money. Although they may be expensive at first, they are cheaper to use in the long term. Drivers do not need to spend a lot of money on fuel.",
                vn: "Cuối cùng, xe điện có thể giúp mọi người tiết kiệm tiền. Mặc dù chúng có thể đắt đỏ lúc đầu, nhưng chúng rẻ hơn khi sử dụng về lâu dài. Người lái xe không cần phải tiêu nhiều tiền cho nhiên liệu."
            },
            {
                en: "To sum up, it’s true that electric cars bring many benefits.",
                vn: "Tóm lại, đúng là xe điện mang lại nhiều lợi ích."
            }
        ]
    },
    {
        id: "test16",
        title: "Topic 16 🌍",
        topic: "There are many ways to protect the environment.",
        promptEn: `<strong>Topic:</strong> There are many ways to protect the environment.<br>` +
            generateMindmap('Protect the environment', 'Not using plastic bags', 'Using public transport', 'your own ideas', 'Using alternative energy sources'),
        promptVn: `<strong>Chủ đề:</strong> Có rất nhiều cách để bảo vệ môi trường.<br>` +
            generateMindmap('Bảo vệ môi trường', 'Không sử dụng túi nilon', 'Sử dụng phương tiện công cộng', 'ý tưởng của bạn', 'Sử dụng các nguồn năng lượng thay thế'),
        vocab: `
            <div class="vocab-section">
                <div class="idea-cards">
                    ${generateVocabItem('01', 'Not using plastic bags', [
                        { en: 'plastic bags => hard to decompose => stay in the environment for many years => pollute rivers, oceans, and soil', vn: 'túi nilon => khó phân hủy => tồn tại trong môi trường nhiều năm => làm ô nhiễm sông, đại dương, và đất' },
                        { en: 'should use cloth bags or paper bags instead of plastic ones', vn: 'nên sử dụng túi vải hoặc túi giấy thay vì túi nilon' }
                    ])}
                    ${generateVocabItem('02', 'Using alternative energy sources', [
                        { en: 'alternative energy sources (solar energy, wind energy, nuclear energy) vs fossil fuel (coal, oil, gas)', vn: 'các nguồn năng lượng thay thế (năng lượng mặt trời, năng lượng gió, năng lượng hạt nhân) so với nhiên liệu hóa thạch (than đá, dầu mỏ, khí đốt)' },
                        { en: 'cleaner + better for the environment', vn: 'sạch hơn + tốt hơn cho môi trường' },
                        { en: 'reduce air pollution + protect natural resources', vn: 'giảm ô nhiễm không khí + bảo vệ tài nguyên thiên nhiên' }
                    ])}
                    ${generateVocabItem('03', 'Using public transport', [
                        { en: 'use public transport (travel by bus or train)', vn: 'sử dụng phương tiện công cộng (đi lại bằng xe buýt hoặc tàu hỏa)' },
                        { en: 'fewer private vehicles on the road => reduce air pollution + traffic jams', vn: 'ít phương tiện cá nhân trên đường hơn => giảm ô nhiễm không khí + ùn tắc giao thông' }
                    ])}
                </div>
            </div>
        `,
        sample: [
            {
                en: "Today, I'd like to talk about some solutions to protect the environment.",
                vn: "Hôm nay, tôi muốn nói về một số giải pháp để bảo vệ môi trường."
            },
            {
                en: "Firstly, people should not use plastic bags. This is because plastic bags are very hard to decompose. They can stay in the environment for many years and pollute rivers, oceans, and soil. Instead, people can use paper bags when they go shopping.",
                vn: "Đầu tiên, mọi người không nên sử dụng túi nilon. Điều này là do túi nilon rất khó phân hủy. Chúng có thể tồn tại trong môi trường trong nhiều năm và làm ô nhiễm sông, đại dương, và đất. Thay vào đó, mọi người có thể sử dụng túi giấy khi đi mua sắm."
            },
            {
                en: "Moreover, another solution is using alternative energy sources. For example, we can use solar energy or wind energy instead of fossil fuels. These sources of energy are cleaner and better for the environment. They can help reduce air pollution and protect natural resources.",
                vn: "Hơn nữa, một giải pháp khác là sử dụng các nguồn năng lượng thay thế. Ví dụ, chúng ta có thể sử dụng năng lượng mặt trời hoặc năng lượng gió thay vì nhiên liệu hóa thạch. Những nguồn năng lượng này sạch hơn và tốt hơn cho môi trường. Chúng có thể giúp giảm ô nhiễm không khí và bảo vệ tài nguyên thiên nhiên."
            },
            {
                en: "Finally, people should use public transport more often. If more people travel by bus or train, there will be fewer private cars and motorbikes on the road. As a result, the air will be cleaner and traffic jams can also be reduced.",
                vn: "Cuối cùng, mọi người nên sử dụng phương tiện công cộng thường xuyên hơn. Nếu có nhiều người đi lại bằng xe buýt hoặc tàu hỏa, sẽ có ít ô tô và xe máy cá nhân trên đường hơn. Kết quả là, không khí sẽ sạch hơn và ùn tắc giao thông cũng có thể được giảm bớt."
            },
            {
                en: "To sum up, it’s true that there are many ways to protect the environment.",
                vn: "Tóm lại, đúng là có nhiều cách để bảo vệ môi trường."
            }
        ]
    },
    {
        id: "test17",
        title: "Topic 17 🎓",
        topic: "Nowadays, many university students both study and work at the same time due to several reasons.",
        promptEn: `<strong>Topic:</strong> Nowadays, many university students both study and work at the same time due to several reasons.<br>` +
            generateMindmap('Study and work', 'cover living costs', 'Gain social experience', 'your own ideas', 'enhance time-management ability'),
        promptVn: `<strong>Chủ đề:</strong> Ngày nay, nhiều sinh viên đại học vừa học vừa làm vì một số lý do.<br>` +
            generateMindmap('Vừa học vừa làm', 'trang trải chi phí sinh hoạt', 'Tích lũy kinh nghiệm xã hội', 'ý tưởng của bạn', 'nâng cao khả năng quản lý thời gian'),
        vocab: `
            <div class="vocab-section">
                <div class="idea-cards">
                    ${generateVocabItem('01', 'Cover living costs', [
                        { en: 'having a part-time job; work part-time; working while studying', vn: 'có một công việc bán thời gian; làm việc bán thời gian; vừa làm vừa học' },
                        { en: 'pay for food, rent, transportation, and tuition fee', vn: 'chi trả cho thức ăn, tiền thuê nhà, đi lại, và học phí' },
                        { en: 'earn money by themselves => reduce the financial pressure on their parents', vn: 'tự kiếm tiền => giảm bớt áp lực tài chính cho cha mẹ' }
                    ])}
                    ${generateVocabItem('02', 'Enhance time-management ability', [
                        { en: 'arrange their schedule carefully => balance their work with their study, homework, and rest => become more organized + responsible', vn: 'sắp xếp lịch trình cẩn thận => cân bằng giữa công việc với việc học, bài tập về nhà, và nghỉ ngơi => trở nên có tổ chức + có trách nhiệm hơn' }
                    ])}
                    ${generateVocabItem('03', 'Gain social experience', [
                        { en: 'working part-time => meet many people + communicate with customers => become more confident + communicate better + gain important soft-skills', vn: 'làm việc bán thời gian => gặp gỡ nhiều người + giao tiếp với khách hàng => trở nên tự tin hơn + giao tiếp tốt hơn + đạt được các kỹ năng mềm quan trọng' }
                    ])}
                </div>
            </div>
        `,
        sample: [
            {
                en: "Today, I'd like to talk about why many university students study and work at the same time.",
                vn: "Hôm nay, tôi muốn nói về lý do tại sao nhiều sinh viên đại học vừa học vừa làm."
            },
            {
                en: "Firstly, having a part-time job can help students cover their living costs. This is because many students need money for food, rent, transportation, and tuition fee. When they can earn some money by themselves, they can reduce the financial pressure on their parents.",
                vn: "Đầu tiên, việc có một công việc bán thời gian có thể giúp sinh viên trang trải chi phí sinh hoạt. Điều này là do nhiều sinh viên cần tiền cho thức ăn, tiền thuê nhà, đi lại và học phí. Khi họ có thể tự kiếm tiền, họ có thể giảm bớt áp lực tài chính cho cha mẹ."
            },
            {
                en: "Moreover, working while studying can help students enhance their time-management ability. They need to arrange their schedule carefully, so they can balance their work with other priorities like their study, homework, and rest. Therefore, they can become more organized and responsible.",
                vn: "Hơn nữa, vừa học vừa làm có thể giúp sinh viên nâng cao khả năng quản lý thời gian của mình. Họ cần sắp xếp lịch trình một cách cẩn thận, để có thể cân bằng giữa công việc với các ưu tiên khác như việc học, bài tập về nhà và nghỉ ngơi. Do đó, họ có thể trở nên có tổ chức và trách nhiệm hơn."
            },
            {
                en: "Finally, students can gain social experience from part-time jobs. When working part-time, students can meet many people and communicate with customers. These experiences help them become more confident, communicate better in social situations, and gain some important soft-skills.",
                vn: "Cuối cùng, sinh viên có thể tích lũy kinh nghiệm xã hội từ các công việc bán thời gian. Khi làm việc bán thời gian, sinh viên có thể gặp gỡ nhiều người và giao tiếp với khách hàng. Những kinh nghiệm này giúp họ trở nên tự tin hơn, giao tiếp tốt hơn trong các tình huống xã hội và đạt được một số kỹ năng mềm quan trọng."
            },
            {
                en: "To sum up, it’s true that there are many reasons why many university students study and work at the same time.",
                vn: "Tóm lại, đúng là có nhiều lý do tại sao nhiều sinh viên đại học vừa học vừa làm."
            }
        ]
    },
    {
        id: "test18",
        title: "Topic 18 🍔",
        topic: "Nowadays, many children are becoming overweight or obese. This can be due to several factors.",
        promptEn: `<strong>Topic:</strong> Nowadays, many children are becoming overweight or obese. This can be due to several factors.<br>` +
            generateMindmap('Overweight or obese', 'Eating unhealthy food', 'Increased screen time', 'your own ideas', 'Lack of physical activities'),
        promptVn: `<strong>Chủ đề:</strong> Ngày nay, nhiều trẻ em đang trở nên thừa cân hoặc béo phì. Điều này có thể do một số yếu tố.<br>` +
            generateMindmap('Thừa cân hoặc béo phì', 'Ăn thực phẩm không lành mạnh', 'Tăng thời gian sử dụng thiết bị điện tử', 'ý tưởng của bạn', 'Thiếu các hoạt động thể chất'),
        vocab: `
            <div class="vocab-section">
                <div class="idea-cards">
                    ${generateVocabItem('01', 'Eating unhealthy food', [
                        { en: 'unhealthy food (fast food, sweets, soft drinks) => popular + delicious + easy to buy', vn: 'thực phẩm không lành mạnh (thức ăn nhanh, đồ ngọt, nước ngọt) => phổ biến + ngon miệng + dễ mua' },
                        { en: 'contain a lot of sugar + fat + calories', vn: 'chứa nhiều đường + chất béo + calo' },
                        { en: 'eat too often => gain weight quickly (get fat; become obese)', vn: 'ăn quá thường xuyên => tăng cân nhanh chóng (trở nên béo; trở nên béo phì)' }
                    ])}
                    ${generateVocabItem('02', 'Lack of physical activities', [
                        { en: 'physical activities (play sports, do exercise)', vn: 'các hoạt động thể chất (chơi thể thao, tập thể dục)' },
                        { en: 'spend most of their time studying or staying at home => get fat', vn: 'dành hầu hết thời gian để học hoặc ở nhà => trở nên béo' }
                    ])}
                    ${generateVocabItem('03', 'Increased screen time', [
                        { en: 'screen time (spend many hours watching TV + using smartphones + playing computer games) => sit still for a long time + move less => become obese', vn: 'thời gian sử dụng thiết bị điện tử (dành nhiều giờ xem TV + sử dụng điện thoại thông minh + chơi trò chơi máy tính) => ngồi yên trong thời gian dài + ít vận động hơn => trở nên béo phì' }
                    ])}
                </div>
            </div>
        `,
        sample: [
            {
                en: "Today, I'd like to talk about some factors causing children’s obesity.",
                vn: "Hôm nay, tôi muốn nói về một số yếu tố gây ra béo phì ở trẻ em."
            },
            {
                en: "Firstly, many children eat unhealthy food. This is because fast food, sweets, and soft drinks are very popular and easy to buy. These foods usually contain a lot of sugar, fat, and calories. If children eat them too often, they can gain weight quickly.",
                vn: "Đầu tiên, nhiều trẻ em ăn thực phẩm không lành mạnh. Điều này là do thức ăn nhanh, đồ ngọt và nước ngọt rất phổ biến và dễ mua. Những thực phẩm này thường chứa nhiều đường, chất béo và calo. Nếu trẻ em ăn chúng quá thường xuyên, chúng có thể tăng cân nhanh chóng."
            },
            {
                en: "Moreover, another factor is a lack of physical activities. Many children do not play sports or do exercise regularly. Instead, they spend most of their time studying or staying at home. Therefore, it's very easy for them to become overweight.",
                vn: "Hơn nữa, một yếu tố khác là sự thiếu hụt các hoạt động thể chất. Nhiều trẻ em không chơi thể thao hoặc tập thể dục thường xuyên. Thay vào đó, chúng dành hầu hết thời gian để học hoặc ở nhà. Do đó, rất dễ dàng để chúng trở nên thừa cân."
            },
            {
                en: "Finally, increased screen time can also lead to obesity in children. Nowadays, children spend many hours watching TV, using smartphones, or playing computer games. This habit makes children sit still for a long time and move less. Over time, they will become fat.",
                vn: "Cuối cùng, việc tăng thời gian sử dụng thiết bị điện tử cũng có thể dẫn đến béo phì ở trẻ em. Ngày nay, trẻ em dành nhiều giờ xem TV, sử dụng điện thoại thông minh hoặc chơi trò chơi máy tính. Thói quen này làm cho trẻ em ngồi yên trong thời gian dài và ít vận động hơn. Theo thời gian, chúng sẽ trở nên béo."
            },
            {
                en: "To sum up, it’s true that many children are becoming overweight, and this can be due to several factors.",
                vn: "Tóm lại, đúng là nhiều trẻ em đang trở nên thừa cân, và điều này có thể do một số yếu tố."
            }
        ]
    },
    {
        id: "test19",
        title: "Topic 19 📉",
        topic: "Nowadays, more and more young people lose their jobs for different reasons.",
        promptEn: `<strong>Topic:</strong> Nowadays, more and more young people lose their jobs for different reasons.<br>` +
            generateMindmap('Lose jobs', 'Health issues', 'Poor attitude and work ethic', 'your own ideas', 'Lack of necessary skills'),
        promptVn: `<strong>Chủ đề:</strong> Ngày nay, ngày càng có nhiều người trẻ mất việc làm vì nhiều lý do khác nhau.<br>` +
            generateMindmap('Mất việc làm', 'Vấn đề sức khỏe', 'Thái độ và đạo đức làm việc kém', 'ý tưởng của bạn', 'Thiếu kỹ năng cần thiết'),
        vocab: `
            <div class="vocab-section">
                <div class="idea-cards">
                    ${generateVocabItem('01', 'Health issues', [
                        { en: 'health issues (physical health issues; mental health issues)', vn: 'các vấn đề sức khỏe (các vấn đề sức khỏe thể chất; các vấn đề sức khỏe tinh thần)' },
                        { en: 'often feel tired, stressed, or sick => cannot work effectively => (X) complete their tasks on time', vn: 'thường cảm thấy mệt mỏi, căng thẳng, hoặc ốm đau => không thể làm việc hiệu quả => (không) hoàn thành nhiệm vụ đúng hạn' }
                    ])}
                    ${generateVocabItem('02', 'Lack of necessary skills', [
                        { en: '(X) have enough professional skills, technical skills, or soft skills for their jobs', vn: '(không) có đủ kỹ năng chuyên môn, kỹ năng kỹ thuật, hoặc kỹ năng mềm cho công việc của họ' },
                        { en: '(X) use some computer programs + communicate well with customers => (X) meet the company\'s expectations', vn: '(không) sử dụng một số chương trình máy tính + giao tiếp tốt với khách hàng => (không) đáp ứng kỳ vọng của công ty' }
                    ])}
                    ${generateVocabItem('03', 'Poor attitude and work ethic', [
                        { en: 'in the workplace, a positive attitude is very important', vn: 'ở nơi làm việc, một thái độ tích cực là rất quan trọng' },
                        { en: 'some people => late + lazy + not willing to learn => create a bad impression on their managers and co-workers', vn: 'một số người => đi trễ + lười biếng + không sẵn sàng học hỏi => tạo ấn tượng xấu với quản lý và đồng nghiệp của họ' }
                    ])}
                </div>
            </div>
        `,
        sample: [
            {
                en: "Today, I'd like to talk about some reasons why young people lose their jobs.",
                vn: "Hôm nay, tôi muốn nói về một số lý do tại sao người trẻ tuổi bị mất việc làm."
            },
            {
                en: "Firstly, young people lose their jobs because of health issues. This can be physical or mental health problems. For example, if they are often tired, stressed, or sick, they cannot work effectively. As a result, they may find it difficult to complete their tasks on time.",
                vn: "Đầu tiên, người trẻ tuổi mất việc vì các vấn đề sức khỏe. Đó có thể là các vấn đề sức khỏe thể chất hoặc tinh thần. Ví dụ, nếu họ thường xuyên mệt mỏi, căng thẳng hoặc ốm đau, họ không thể làm việc hiệu quả. Kết quả là, họ có thể thấy khó khăn trong việc hoàn thành nhiệm vụ đúng hạn."
            },
            {
                en: "Moreover, another important reason is a lack of necessary skills. Some young workers do not have enough technical skills or soft skills for their jobs. For example, they probably don't know how to use some important computer programs, or they cannot communicate well with customers. As a result, they cannot meet the company’s expectations.",
                vn: "Hơn nữa, một lý do quan trọng khác là sự thiếu hụt các kỹ năng cần thiết. Một số công nhân trẻ không có đủ kỹ năng kỹ thuật hoặc kỹ năng mềm cho công việc của họ. Ví dụ, họ có thể không biết cách sử dụng một số chương trình máy tính quan trọng, hoặc họ không thể giao tiếp tốt với khách hàng. Kết quả là, họ không thể đáp ứng được những kỳ vọng của công ty."
            },
            {
                en: "Finally, poor attitude and work ethic can also make young people lose their jobs. This is because in the workplace, a positive attitude is very important. However, some people are often late, lazy, careless, or not willing to learn. This can create a bad impression on their managers and co-workers.",
                vn: "Cuối cùng, thái độ và đạo đức làm việc kém cũng có thể khiến người trẻ tuổi mất việc làm. Điều này là do ở nơi làm việc, một thái độ tích cực là rất quan trọng. Tuy nhiên, một số người thường xuyên đi trễ, lười biếng, bất cẩn hoặc không sẵn sàng học hỏi. Điều này có thể tạo ra một ấn tượng xấu đối với các quản lý và đồng nghiệp của họ."
            },
            {
                en: "To sum up, it’s true that young people may lose their jobs for different reasons.",
                vn: "Tóm lại, đúng là người trẻ tuổi có thể mất việc làm vì những lý do khác nhau."
            }
        ]
    },
    {
        id: "test20",
        title: "Topic 20 🤝",
        topic: "Good relationships at work are very important for employees and companies.",
        promptEn: `<strong>Topic:</strong> Good relationships at work are very important for employees and companies.<br>` +
            generateMindmap('Relationships at work', 'Higher productivity', 'Better collaboration', 'your own ideas', 'Higher level of job satisfaction'),
        promptVn: `<strong>Chủ đề:</strong> Các mối quan hệ tốt ở nơi làm việc rất quan trọng đối với nhân viên và công ty.<br>` +
            generateMindmap('Mối quan hệ ở nơi làm việc', 'Năng suất cao hơn', 'Sự cộng tác tốt hơn', 'ý tưởng của bạn', 'Mức độ hài lòng với công việc cao hơn'),
        vocab: `
            <div class="vocab-section">
                <div class="idea-cards">
                    ${generateVocabItem('01', 'Higher productivity', [
                        { en: 'feel comfortable with their colleagues => focus better on their tasks', vn: 'cảm thấy thoải mái với đồng nghiệp của họ => tập trung tốt hơn vào nhiệm vụ của họ' },
                        { en: 'more willing to help each other => complete their tasks more quickly and effectively', vn: 'sẵn sàng giúp đỡ lẫn nhau hơn => hoàn thành nhiệm vụ của họ nhanh chóng và hiệu quả hơn' }
                    ])}
                    ${generateVocabItem('02', 'Higher level of job satisfaction', [
                        { en: 'employees often spend many hours at work every day => a friendly working environment (important)', vn: 'nhân viên thường dành nhiều giờ tại nơi làm việc mỗi ngày => một môi trường làm việc thân thiện (quan trọng)' },
                        { en: 'co-workers (kind and supportive) => feel happier + less stressed', vn: 'đồng nghiệp (tốt bụng và hay giúp đỡ) => cảm thấy hạnh phúc hơn + ít căng thẳng hơn' }
                    ])}
                    ${generateVocabItem('03', 'Better collaboration', [
                        { en: 'In many jobs => need to work in teams + share opinions with others', vn: 'Trong nhiều công việc => cần làm việc theo nhóm + chia sẻ ý kiến với người khác' },
                        { en: 'employees => trust each other => communicate more easily + solve problems together => achieve better results', vn: 'nhân viên => tin tưởng lẫn nhau => giao tiếp dễ dàng hơn + cùng nhau giải quyết vấn đề => đạt được kết quả tốt hơn' }
                    ])}
                </div>
            </div>
        `,
        sample: [
            {
                en: "Today, I'd like to talk about the benefits of good workplace relationships.",
                vn: "Hôm nay, tôi muốn nói về những lợi ích của các mối quan hệ tốt đẹp nơi làm việc."
            },
            {
                en: "Firstly, good relationships at work can help employees have higher productivity. This is because when people feel comfortable with their colleagues, they can focus better on their tasks. They are also more willing to help each other, so people can complete their tasks more quickly and effectively.",
                vn: "Đầu tiên, các mối quan hệ tốt tại nơi làm việc có thể giúp nhân viên có năng suất cao hơn. Điều này là do khi mọi người cảm thấy thoải mái với đồng nghiệp của họ, họ có thể tập trung tốt hơn vào nhiệm vụ của mình. Họ cũng sẵn sàng giúp đỡ lẫn nhau hơn, vì vậy mọi người có thể hoàn thành nhiệm vụ của họ nhanh chóng và hiệu quả hơn."
            },
            {
                en: "Moreover, good workplace relationships can lead to a higher level of job satisfaction. Employees often spend many hours at work every day, so a friendly working environment is very important. If they have kind and supportive co-workers, they can feel happier and less stressed at work.",
                vn: "Hơn nữa, các mối quan hệ tốt đẹp tại nơi làm việc có thể dẫn đến mức độ hài lòng với công việc cao hơn. Nhân viên thường dành nhiều giờ tại nơi làm việc mỗi ngày, do đó một môi trường làm việc thân thiện là rất quan trọng. Nếu họ có những đồng nghiệp tốt bụng và hay giúp đỡ, họ có thể cảm thấy hạnh phúc hơn và bớt căng thẳng hơn tại nơi làm việc."
            },
            {
                en: "Finally, good relationships can improve collaboration. In many jobs, people need to work in teams and share ideas with others. When employees trust each other, they can communicate more easily and solve problems together. As a result, the team can achieve better results.",
                vn: "Cuối cùng, các mối quan hệ tốt có thể cải thiện sự cộng tác. Trong nhiều công việc, mọi người cần làm việc theo nhóm và chia sẻ ý tưởng với người khác. Khi nhân viên tin tưởng lẫn nhau, họ có thể giao tiếp dễ dàng hơn và cùng nhau giải quyết vấn đề. Kết quả là, nhóm có thể đạt được những kết quả tốt hơn."
            },
            {
                en: "To sum up, it’s true that Good relationships at work are very important for employees and companies.",
                vn: "Tóm lại, đúng là các mối quan hệ tốt ở nơi làm việc rất quan trọng đối với nhân viên và công ty."
            }
        ]
    },
    {
        id: "test21",
        title: "Topic 21 👥",
        topic: "Teamwork is very important in a professional working environment.",
        promptEn: `<strong>Topic:</strong> Teamwork is very important in a professional working environment.<br>` +
            generateMindmap('Teamwork', 'Shared responsibility', 'Diverse perspectives', 'your own ideas', 'Leadership development'),
        promptVn: `<strong>Chủ đề:</strong> Làm việc nhóm rất quan trọng trong một môi trường làm việc chuyên nghiệp.<br>` +
            generateMindmap('Làm việc nhóm', 'Chia sẻ trách nhiệm', 'Quan điểm đa dạng', 'ý tưởng của bạn', 'Phát triển năng lực lãnh đạo'),
        vocab: `
            <div class="vocab-section">
                <div class="idea-cards">
                    ${generateVocabItem('01', 'Shared responsibility', [
                        { en: 'Teamwork (work in a team, work in groups) => (X) do everything alone', vn: 'Làm việc nhóm (làm việc trong một đội, làm việc theo nhóm) => (không) làm mọi thứ một mình' },
                        { en: 'Each member => take care of a different task => the work becomes easier + complete the task more quickly', vn: 'Mỗi thành viên => đảm nhận một nhiệm vụ khác nhau => công việc trở nên dễ dàng hơn + hoàn thành nhiệm vụ nhanh chóng hơn' }
                    ])}
                    ${generateVocabItem('02', 'Leadership development', [
                        { en: 'each member => have the opportunity to lead a small task + give instructions => learn how to make decisions + solve problems => very useful for their future career', vn: 'mỗi thành viên => có cơ hội dẫn dắt một nhiệm vụ nhỏ + đưa ra hướng dẫn => học cách đưa ra quyết định + giải quyết vấn đề => rất hữu ích cho sự nghiệp tương lai của họ' }
                    ])}
                    ${generateVocabItem('03', 'Diverse perspectives', [
                        { en: 'each person => different strengths, different knowledge, different experience', vn: 'mỗi người => những điểm mạnh khác nhau, kiến thức khác nhau, kinh nghiệm khác nhau' },
                        { en: 'team members => share their ideas => view the problem in many different perspectives => find the best solution', vn: 'các thành viên trong nhóm => chia sẻ ý tưởng của họ => nhìn nhận vấn đề ở nhiều quan điểm khác nhau => tìm ra giải pháp tốt nhất' }
                    ])}
                </div>
            </div>
        `,
        sample: [
            {
                en: "Today, I'd like to talk about the benefits of teamwork in a professional environment.",
                vn: "Hôm nay, tôi muốn nói về những lợi ích của việc làm việc nhóm trong một môi trường chuyên nghiệp."
            },
            {
                en: "Firstly, teamwork helps employees share responsibility. This is because when people work in a team, they do not have to do everything alone. Each member can take care of a different task. As a result, the work becomes easier and the team can complete the task more quickly.",
                vn: "Đầu tiên, làm việc nhóm giúp nhân viên chia sẻ trách nhiệm. Điều này là do khi mọi người làm việc trong một nhóm, họ không phải làm mọi thứ một mình. Mỗi thành viên có thể đảm nhận một nhiệm vụ khác nhau. Kết quả là, công việc trở nên dễ dàng hơn và nhóm có thể hoàn thành nhiệm vụ nhanh chóng hơn."
            },
            {
                en: "Moreover, teamwork can help employees develop leadership skills. In a team, each member can have opportunities to lead a small task or give instructions. Therefore, They can learn how to make decisions and solve problems. These skills are very useful for their future career.",
                vn: "Hơn nữa, làm việc nhóm có thể giúp nhân viên phát triển các kỹ năng lãnh đạo. Trong một nhóm, mỗi thành viên có thể có cơ hội dẫn dắt một nhiệm vụ nhỏ hoặc đưa ra hướng dẫn. Do đó, họ có thể học cách đưa ra quyết định và giải quyết vấn đề. Những kỹ năng này rất hữu ích cho sự nghiệp tương lai của họ."
            },
            {
                en: "Finally, teamwork brings diverse perspectives. In fact, each person has different strengths, knowledge, experience, and opinions. When team members share their ideas, they can view the problem in many different perspectives, and find the best solution. This will greatly improve work productivity.",
                vn: "Cuối cùng, làm việc nhóm mang lại những quan điểm đa dạng. Trên thực tế, mỗi người đều có những điểm mạnh, kiến thức, kinh nghiệm và ý kiến khác nhau. Khi các thành viên trong nhóm chia sẻ ý tưởng của mình, họ có thể nhìn nhận vấn đề dưới nhiều góc độ khác nhau và tìm ra giải pháp tốt nhất. Điều này sẽ cải thiện đáng kể năng suất làm việc."
            },
            {
                en: "To sum up, it’s true that teamwork is very important in a professional working environment.",
                vn: "Tóm lại, đúng là làm việc nhóm rất quan trọng trong một môi trường làm việc chuyên nghiệp."
            }
        ]
    }
];
