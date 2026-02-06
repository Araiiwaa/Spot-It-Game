const emojis = ["🍎", "🍌", "🌵", "💎", "🐘", "🔥", "🎸", "🚁", "🍦", "🎃", "🍀", "🌙", "🍕", "🚀", "🌈", "☀️", "🍄", "🎁", "⚽", "🍔", "🦄", "🦜", "💡", "🔑", "🚗", "🏆", "🍿", "🍩", "🐳", "🎨", "🎭"];
    let score = 0;
    let currentC1, currentC2;

    function getDeck() {
        const n = 5; let d = [];
        for (let i = 0; i <= n; i++) {
            let c = [0];
            for (let j = 0; j < n; j++) c.push((j + 1) + (i * n));
            d.push(c);
        }
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                let c = [i + 1];
                for (let k = 0; k < n; k++) c.push((n + 1) + n * k + (i * k + j) % n);
                d.push(c);
            }
        }
        return d;
    }

    const deck = getDeck();

    function draw(id, indices) {
        const el = document.getElementById(id);
        el.innerHTML = '';
        const placedItems = []; // Keep track of where we put things

        indices.forEach((idx) => {
            const s = document.createElement('span');
            s.className = 'symbol';
            s.innerText = emojis[idx];
            
            let size, x, y, overlap;
            let attempts = 0;

            // Collision Detection Loop
            do {
                overlap = false;
                size = Math.floor(Math.random() * 25) + 22; // Hard mode sizes
                
                // Random position within the circular bounds (radius ~55)
                const angle = Math.random() * Math.PI * 2;
                const dist = Math.random() * 45; 
                x = 75 + dist * Math.cos(angle);
                y = 75 + dist * Math.sin(angle);

                // Check against every symbol already placed on this card
                for (let placed of placedItems) {
                    const dx = x - placed.x;
                    const dy = y - placed.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    // If distance is less than the combined sizes, they overlap
                    if (distance < (size / 2 + placed.size / 2 + 10)) { 
                        overlap = true;
                        break;
                    }
                }
                attempts++;
            } while (overlap && attempts < 100); // Try 100 times to find a gap

            placedItems.push({ x, y, size });

            const rot = Math.random() * 360;
            s.style.cssText = `
                left: ${x}px; 
                top: ${y}px; 
                font-size: ${size}px; 
                transform: translate(-50%, -50%) rotate(${rot}deg);
            `;

            s.onclick = (e) => {
                e.stopPropagation();
                const match = currentC1.filter(v => currentC2.includes(v))[0];
                if (idx === match) {
                    score++;
                    document.getElementById('score').innerText = score;
                    next();
                } else {
                    el.style.borderColor = "#ff5252";
                    setTimeout(() => el.style.borderColor = "var(--border)", 200);
                }
            };
            el.appendChild(s);
        });
    }

    function next() {
        let i1 = Math.floor(Math.random() * deck.length);
        let i2 = Math.floor(Math.random() * deck.length);
        while(i1 === i2) i2 = Math.floor(Math.random() * deck.length);
        currentC1 = deck[i1]; currentC2 = deck[i2];
        draw('card1', currentC1);
        draw('card2', currentC2);
    }

    next();