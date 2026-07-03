//  ÉLÉMENTS DU DOM 
        const gameContainer = document.getElementById('game-container');
        const targetArea = document.getElementById('target-area');
        const cannon = document.getElementById('cannon');
        const wordInput = document.getElementById('word-input');
        const launchButton = document.getElementById('launch-button');
        const scoreDisplay = document.getElementById('score-display');
        const timerDisplay = document.getElementById('timer-display');
        
        //  boutons mobiles 
        const moveLeftButton = document.getElementById('move-left');
        const moveRightButton = document.getElementById('move-right');


        // PARAMÈTRES DU JEU 
        const targetWordList = ["HTML", "CSS", "JS", "REACT", "AI", "INDD", "PSD" , "BLEND" , "AEP" , "VUEJS", "WORDPRESS" , " ; ) " ]; // Moins de mots pour mobile
        const PROJECTILE_SPEED = 8;
        const CANNON_SPEED = 7; 
        const TARGET_BASE_SPEED = 5;
        const POINTS_PER_HIT = 10;

        //  ÉTAT DU JEU
        let cannonX = 0; 
        let targets = []; 
        let projectiles = []; 
        let score = 0;
        let startTime = 0; 
        let isTimerRunning = false; 

        // États pour le mouvement tactile 
        let isMovingLeft = false;
        let isMovingRight = false;

        //  FONCTIONS DE GESTION 
        function setupTargets() {
            targetArea.innerHTML = '';
            targets = []; 

            const areaWidth = targetArea.clientWidth;
            const areaHeight = targetArea.clientHeight;

            targetWordList.forEach(word => {
                const wordEl = document.createElement('div');
                wordEl.classList.add('target-word');
                wordEl.textContent = word;
                wordEl.dataset.word = word;

                const targetObj = {
                    element: wordEl,
                    word: word,
                    x: Math.random() * (areaWidth - 100), // -80 pour la largeur du mot
                    y: Math.random() * (areaHeight - 60), // -40 pour la hauteur
                    dx: (Math.random() - 0.5) * 2 * TARGET_BASE_SPEED, 
                    dy: (Math.random() - 0.5) * 2 * TARGET_BASE_SPEED  
                };
                wordEl.style.left = `${targetObj.x}px`;
                wordEl.style.top = `${targetObj.y}px`;
                targetArea.appendChild(wordEl);
                targets.push(targetObj);
            });
            
            startTime = Date.now();
            isTimerRunning = true;
            timerDisplay.textContent = "Temps : 0s";
        }
        
        function updateScoreDisplay() { 
            scoreDisplay.textContent = `Score : ${score}`;
        }

        function launchProjectile() {
            const wordToLaunch = wordInput.value.trim().toUpperCase();
            if (!wordToLaunch) return;

            const projectile = document.createElement('div');
            projectile.classList.add('projectile');
            projectile.textContent = wordToLaunch;
            projectile.dataset.word = wordToLaunch;
            gameContainer.appendChild(projectile);
            
            const projWidth = projectile.clientWidth; 
            const projX = cannonX + (cannon.clientWidth / 2) - (projWidth / 2);
            projectile.style.left = `${projX}px`;

            projectiles.push({
                element: projectile,
                word: wordToLaunch,
                bottom: 35, // Ajusté à la taille du canon
                speed: PROJECTILE_SPEED
            });
            wordInput.value = '';
        }

        //  Fonction de mouvement générique 
        function moveCannon(direction) {
            const minX = 0;
            const maxX = gameContainer.clientWidth - cannon.clientWidth;

            if (direction === 'left') {
                cannonX -= CANNON_SPEED;
            } else if (direction === 'right') {
                cannonX += CANNON_SPEED;
            }
            
            cannonX = Math.max(minX, Math.min(maxX, cannonX));
            cannon.style.left = `${cannonX}px`;
        }

        function handleKeyInput(e) {
            // Le clavier physique contrôle l'état 
            if (e.key === 'ArrowLeft') {
                isMovingLeft = true;
            } else if (e.key === 'ArrowRight') {
                isMovingRight = true;
            } else if (e.key === 'Enter' || e.key === ' ') { 
                e.preventDefault(); 
                launchProjectile();
            }
        }
        
        //  Gérer la fin de l'appui touche 
        function handleKeyUp(e) {
            if (e.key === 'ArrowLeft') {
                isMovingLeft = false;
            } else if (e.key === 'ArrowRight') {
                isMovingRight = false;
            }
        }

        function isColliding(el1, el2) {
            const rect1 = el1.getBoundingClientRect();
            const rect2 = el2.getBoundingClientRect();
            return !(
                rect1.top > rect2.bottom ||
                rect1.bottom < rect2.top ||
                rect1.left > rect2.right ||
                rect1.right < rect2.left
            );
        }

        function explodeTarget(targetObj) {
            targetObj.element.classList.add('explosion');
            targets = targets.filter(t => t !== targetObj);

            score += POINTS_PER_HIT;
            updateScoreDisplay();    

            setTimeout(() => {
                targetObj.element.remove();
                
                if (targets.length === 0) {
                    isTimerRunning = false; 
                    const finalTime = Math.floor((Date.now() - startTime) / 1000);
                    alert(`Niveau terminé ! Score : ${score} | Temps : ${finalTime}s`);
                    setupTargets(); 
                }
            }, 300);
        } 

        // LA BOUCLE DE JEU

        function updateTargets() {
            const areaWidth = targetArea.clientWidth;
            const areaHeight = targetArea.clientHeight;

            targets.forEach(target => {
                target.x += target.dx;
                target.y += target.dy;
                if (target.x <= 0 || target.x + target.element.clientWidth >= areaWidth) {
                    target.dx *= -1; 
                }
                if (target.y <= 0 || target.y + target.element.clientHeight >= areaHeight) {
                    target.dy *= -1; 
                }
                target.element.style.left = `${target.x}px`;
                target.element.style.top = `${target.y}px`;
            });
        }

        function updateProjectiles() {
            for (let i = projectiles.length - 1; i >= 0; i--) {
                const proj = projectiles[i];
                proj.bottom += proj.speed;
                proj.element.style.bottom = `${proj.bottom}px`;
                if (proj.bottom > gameContainer.clientHeight) {
                    proj.element.remove();
                    projectiles.splice(i, 1);
                }
            }
        }

        function checkCollisions() {
            for (let i = projectiles.length - 1; i >= 0; i--) {
                const proj = projectiles[i];
                for (let j = targets.length - 1; j >= 0; j--) {
                    const target = targets[j];
                    if (isColliding(proj.element, target.element)) {
                        if (proj.word === target.word) {
                            explodeTarget(target);
                            proj.element.remove();
                            projectiles.splice(i, 1);
                            break; 
                        }
                    }
                }
            }
        }

        function gameLoop() {
            // Gère le mouvement continu 
            if (isMovingLeft) {
                moveCannon('left');
            }
            if (isMovingRight) {
                moveCannon('right');
            }

            if (isTimerRunning) {
                const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
                timerDisplay.textContent = `Temps : ${elapsedSeconds}s`;
            }

            updateTargets();
            updateProjectiles();
            checkCollisions();
            requestAnimationFrame(gameLoop);
        }
        
        // Fonction pour centrer le canon
        function centerCannon() {
            cannonX = (gameContainer.clientWidth / 2) - (cannon.clientWidth / 2);
            cannon.style.left = `${cannonX}px`;
        }

        //  ÉCOUTEURS D'ÉVÉNEMENTS 
        launchButton.addEventListener('click', launchProjectile);
        
        // Clavier
        window.addEventListener('keydown', handleKeyInput);
        window.addEventListener('keyup', handleKeyUp); // <-- MODIFIÉ

        //  Écouteurs pour les boutons tactiles 
        moveLeftButton.addEventListener('mousedown', () => isMovingLeft = true);
        moveLeftButton.addEventListener('mouseup', () => isMovingLeft = false);
        moveLeftButton.addEventListener('touchstart', (e) => { e.preventDefault(); isMovingLeft = true; });
        moveLeftButton.addEventListener('touchend', () => isMovingLeft = false);

        moveRightButton.addEventListener('mousedown', () => isMovingRight = true);
        moveRightButton.addEventListener('mouseup', () => isMovingRight = false);
        moveRightButton.addEventListener('touchstart', (e) => { e.preventDefault(); isMovingRight = true; });
        moveRightButton.addEventListener('touchend', () => isMovingRight = false);


        // INITIALISATION
        centerCannon(); // Centre le canon au début
        setupTargets(); // Crée les cibles
        gameLoop(); 
