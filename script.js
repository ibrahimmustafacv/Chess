// Chess Board and Game Logic
class ChessApp {
    constructor() {
        this.board = null;
        this.selectedSquare = null;
        this.currentPiece = null;
        this.gameState = this.initializeBoard();
        this.pieceUnicodes = {
            'king': { white: '♔', black: '♚' },
            'queen': { white: '♕', black: '♛' },
            'rook': { white: '♖', black: '♜' },
            'bishop': { white: '♗', black: '♝' },
            'knight': { white: '♘', black: '♞' },
            'pawn': { white: '♙', black: '♟' }
        };
        
        this.pieceInfo = {
            'king': {
                name: 'الملك',
                description: 'أهم قطعة في اللعبة. يتحرك مربعاً واحداً في أي اتجاه (أفقي، عمودي، أو قطري). الهدف من اللعبة هو حماية ملكك وتهديد ملك الخصم.',
                moves: 'مربع واحد في أي اتجاه',
                value: 'لا تُقدر بثمن'
            },
            'queen': {
                name: 'الوزير',
                description: 'أقوى قطعة في اللعبة. تجمع بين حركات الطابية والفيل، فيمكنها التحرك في أي اتجاه (أفقي، عمودي، أو قطري) لأي مسافة.',
                moves: 'أي اتجاه لأي مسافة',
                value: '9 نقاط'
            },
            'rook': {
                name: 'الطابية',
                description: 'قطعة قوية تتحرك أفقياً وعمودياً. تلعب دوراً مهماً في حماية الملك والسيطرة على الصفوف والأعمدة.',
                moves: 'أفقياً وعمودياً لأي مسافة',
                value: '5 نقاط'
            },
            'bishop': {
                name: 'الفيل',
                description: 'يتحرك قطرياً فقط. كل لاعب لديه فيلان، واحد على المربعات الفاتحة وآخر على المربعات الداكنة.',
                moves: 'قطرياً لأي مسافة',
                value: '3 نقاط'
            },
            'knight': {
                name: 'الحصان',
                description: 'القطعة الوحيدة التي يمكنها "القفز" فوق القطع الأخرى. يتحرك على شكل حرف L (مربعان في اتجاه ومربع في الاتجاه العمودي).',
                moves: 'على شكل حرف L',
                value: '3 نقاط'
            },
            'pawn': {
                name: 'الجندي',
                description: 'أصغر قطعة ولكنها مهمة. يتحرك للأمام مربعاً واحداً، ويأكل قطرياً. في حركته الأولى يمكنه التحرك مربعين.',
                moves: 'للأمام مربع واحد، يأكل قطرياً',
                value: '1 نقطة'
            }
        };
        
        this.specialMoves = {
            'castling': {
                name: 'التبييت',
                description: 'حركة خاصة تسمح للملك والطابية بالتحرك معاً في حركة واحدة. الهدف هو حماية الملك وتطوير الطابية. يمكن التبييت من الجهة الملكية (قصير) أو من جهة الوزير (طويل).',
                conditions: 'لم يتحرك الملك أو الطابية من قبل، لا توجد قطع بينهما، الملك ليس في كش',
                benefit: 'يحمي الملك ويطور الطابية في نفس الوقت'
            },
            'promotion': {
                name: 'الترقية',
                description: 'عندما يصل الجندي إلى الصف الثامن (نهاية الرقعة)، يجب ترقيته إلى أي قطعة عدا الملك. عادة يُرقى إلى وزير لأنه الأقوى.',
                conditions: 'الجندي يصل إلى نهاية الرقعة (الصف الثامن)',
                benefit: 'تحويل أضعف قطعة إلى قطعة قوية جداً'
            }
        };
        
        this.init();
    }

    // Initialize the chess board state
    initializeBoard() {
        const board = Array(8).fill().map(() => Array(8).fill(null));
        
        // Place pieces in starting positions
        // Black pieces (top)
        board[0] = [
            {type: 'rook', color: 'black'},
            {type: 'knight', color: 'black'},
            {type: 'bishop', color: 'black'},
            {type: 'queen', color: 'black'},
            {type: 'king', color: 'black'},
            {type: 'bishop', color: 'black'},
            {type: 'knight', color: 'black'},
            {type: 'rook', color: 'black'}
        ];
        
        for (let i = 0; i < 8; i++) {
            board[1][i] = {type: 'pawn', color: 'black'};
            board[6][i] = {type: 'pawn', color: 'white'};
        }
        
        // White pieces (bottom)
        board[7] = [
            {type: 'rook', color: 'white'},
            {type: 'knight', color: 'white'},
            {type: 'bishop', color: 'white'},
            {type: 'queen', color: 'white'},
            {type: 'king', color: 'white'},
            {type: 'bishop', color: 'white'},
            {type: 'knight', color: 'white'},
            {type: 'rook', color: 'white'}
        ];
        
        return board;
    }

    // Initialize the application
    init() {
        this.createBoard();
        this.setupEventListeners();
        this.updatePieceInfo();
    }

    // Create the visual chess board
    createBoard() {
        const boardElement = document.getElementById('chessBoard');
        boardElement.innerHTML = '';
        
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const square = document.createElement('div');
                square.className = `chess-square ${(row + col) % 2 === 0 ? 'light' : 'dark'}`;
                square.dataset.row = row;
                square.dataset.col = col;
                
                const piece = this.gameState[row][col];
                if (piece) {
                    const pieceSymbol = this.pieceUnicodes[piece.type][piece.color];
                    square.textContent = pieceSymbol;
                    square.classList.add('piece-loading');
                }
                
                square.addEventListener('click', (e) => this.handleSquareClick(e));
                boardElement.appendChild(square);
            }
        }
    }

    // Handle square click events
    handleSquareClick(event) {
        const square = event.target;
        const row = parseInt(square.dataset.row);
        const col = parseInt(square.dataset.col);
        const piece = this.gameState[row][col];

        // Clear previous highlights
        this.clearHighlights();

        if (piece) {
            // Select piece and show possible moves
            this.selectedSquare = {row, col};
            this.currentPiece = piece;
            square.classList.add('selected');
            this.showPossibleMoves(piece.type, row, col);
            this.updatePieceInfo(piece.type);
        } else {
            this.selectedSquare = null;
            this.currentPiece = null;
            this.updatePieceInfo();
        }
    }

    // Show possible moves for a piece
    showPossibleMoves(pieceType, row, col) {
        const moves = this.getPossibleMoves(pieceType, row, col);
        
        moves.forEach(move => {
            const square = document.querySelector(`[data-row="${move.row}"][data-col="${move.col}"]`);
            if (square) {
                square.classList.add('possible-move');
            }
        });
    }

    // Calculate possible moves for each piece type
    getPossibleMoves(pieceType, row, col) {
        const moves = [];
        
        switch (pieceType) {
            case 'king':
                // King moves one square in any direction
                for (let dRow = -1; dRow <= 1; dRow++) {
                    for (let dCol = -1; dCol <= 1; dCol++) {
                        if (dRow === 0 && dCol === 0) continue;
                        const newRow = row + dRow;
                        const newCol = col + dCol;
                        if (this.isValidSquare(newRow, newCol)) {
                            moves.push({row: newRow, col: newCol});
                        }
                    }
                }
                break;
                
            case 'queen':
                // Queen combines rook and bishop moves
                moves.push(...this.getRookMoves(row, col));
                moves.push(...this.getBishopMoves(row, col));
                break;
                
            case 'rook':
                moves.push(...this.getRookMoves(row, col));
                break;
                
            case 'bishop':
                moves.push(...this.getBishopMoves(row, col));
                break;
                
            case 'knight':
                // Knight moves in L-shape
                const knightMoves = [
                    [-2, -1], [-2, 1], [-1, -2], [-1, 2],
                    [1, -2], [1, 2], [2, -1], [2, 1]
                ];
                knightMoves.forEach(([dRow, dCol]) => {
                    const newRow = row + dRow;
                    const newCol = col + dCol;
                    if (this.isValidSquare(newRow, newCol)) {
                        moves.push({row: newRow, col: newCol});
                    }
                });
                break;
                
            case 'pawn':
                // Pawn moves forward (simplified for demonstration)
                const direction = this.gameState[row][col].color === 'white' ? -1 : 1;
                const newRow = row + direction;
                if (this.isValidSquare(newRow, col)) {
                    moves.push({row: newRow, col});
                }
                // Initial two-square move
                if ((row === 6 && direction === -1) || (row === 1 && direction === 1)) {
                    const doubleRow = row + (2 * direction);
                    if (this.isValidSquare(doubleRow, col)) {
                        moves.push({row: doubleRow, col});
                    }
                }
                // Diagonal captures (show potential)
                [-1, 1].forEach(dCol => {
                    const captureRow = row + direction;
                    const captureCol = col + dCol;
                    if (this.isValidSquare(captureRow, captureCol)) {
                        moves.push({row: captureRow, col: captureCol});
                    }
                });
                break;
        }
        
        return moves;
    }

    // Get rook moves (horizontal and vertical)
    getRookMoves(row, col) {
        const moves = [];
        const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];
        
        directions.forEach(([dRow, dCol]) => {
            for (let i = 1; i < 8; i++) {
                const newRow = row + (dRow * i);
                const newCol = col + (dCol * i);
                if (!this.isValidSquare(newRow, newCol)) break;
                moves.push({row: newRow, col: newCol});
            }
        });
        
        return moves;
    }

    // Get bishop moves (diagonal)
    getBishopMoves(row, col) {
        const moves = [];
        const directions = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
        
        directions.forEach(([dRow, dCol]) => {
            for (let i = 1; i < 8; i++) {
                const newRow = row + (dRow * i);
                const newCol = col + (dCol * i);
                if (!this.isValidSquare(newRow, newCol)) break;
                moves.push({row: newRow, col: newCol});
            }
        });
        
        return moves;
    }

    // Check if square is valid
    isValidSquare(row, col) {
        return row >= 0 && row < 8 && col >= 0 && col < 8;
    }

    // Clear all highlights
    clearHighlights() {
        document.querySelectorAll('.chess-square').forEach(square => {
            square.classList.remove('highlighted', 'possible-move', 'selected', 'promotion-option');
            // Reset any modified styles
            if (square.style.color || square.style.fontSize) {
                square.style.color = '';
                square.style.fontSize = '';
            }
        });
    }

    // Reset board to initial position
    resetBoard() {
        this.gameState = this.initializeBoard();
        this.selectedSquare = null;
        this.currentPiece = null;
        this.createBoard();
        this.updatePieceInfo();
    }

    // Update piece information display
    updatePieceInfo(pieceType = null, isDemoMode = false) {
        const infoElement = document.getElementById('pieceInfo');
        
        if (pieceType && this.pieceInfo[pieceType]) {
            const info = this.pieceInfo[pieceType];
            let moveInstructions = '';
            
            if (isDemoMode) {
                switch(pieceType) {
                    case 'king':
                        moveInstructions = '<p class="demo-instruction"><i class="fas fa-hand-pointer"></i> الملك يتحرك مربعاً واحداً فقط في أي اتجاه من المربعات الخضراء المضيئة</p>';
                        break;
                    case 'queen':
                        moveInstructions = '<p class="demo-instruction"><i class="fas fa-hand-pointer"></i> الوزير يتحرك في أي اتجاه لأي مسافة - شاهد جميع المسارات الخضراء</p>';
                        break;
                    case 'rook':
                        moveInstructions = '<p class="demo-instruction"><i class="fas fa-hand-pointer"></i> الطابية تتحرك أفقياً وعمودياً فقط في خطوط مستقيمة</p>';
                        break;
                    case 'bishop':
                        moveInstructions = '<p class="demo-instruction"><i class="fas fa-hand-pointer"></i> الفيل يتحرك قطرياً فقط في خطوط مائلة</p>';
                        break;
                    case 'knight':
                        moveInstructions = '<p class="demo-instruction"><i class="fas fa-hand-pointer"></i> الحصان يقفز على شكل حرف L - مربعان في اتجاه ومربع عمودياً</p>';
                        break;
                    case 'pawn':
                        moveInstructions = '<p class="demo-instruction"><i class="fas fa-hand-pointer"></i> الجندي يتحرك للأمام مربعاً واحداً، ويأكل قطرياً</p>';
                        break;
                }
            }
            
            infoElement.innerHTML = `
                <h3>${info.name} ${isDemoMode ? '- وضع التعلم' : ''}</h3>
                <p><strong>الوصف:</strong> ${info.description}</p>
                <p><strong>الحركة:</strong> ${info.moves}</p>
                <p><strong>القيمة:</strong> ${info.value}</p>
                ${moveInstructions}
                ${isDemoMode ? '<p class="reset-hint"><i class="fas fa-redo"></i> اضغط على "إعادة تعيين" لعرض الرقعة كاملة مرة أخرى</p>' : ''}
            `;
        } else {
            infoElement.innerHTML = `
                <h3>معلومات القطعة</h3>
                <p>انقر على أي قطعة لمشاهدة تفاصيلها وحركاتها المسموحة</p>
            `;
        }
    }

    // Show specific piece moves (called from piece cards)
    showSpecificPieceMoves(pieceType) {
        this.clearHighlights();
        
        // Clear the board completely
        this.gameState = Array(8).fill().map(() => Array(8).fill(null));
        
        // Place the selected piece in the center of the board (row 4, col 4)
        const centerRow = 3;
        const centerCol = 3;
        this.gameState[centerRow][centerCol] = {type: pieceType, color: 'white'};
        
        // Re-create the board with only the selected piece
        this.createBoard();
        
        // Highlight the piece and show its moves
        const centerSquare = document.querySelector(`[data-row="${centerRow}"][data-col="${centerCol}"]`);
        centerSquare.classList.add('highlighted');
        this.showPossibleMoves(pieceType, centerRow, centerCol);
        this.updatePieceInfo(pieceType, true);
        
        // Scroll to board
        document.getElementById('board').scrollIntoView({ 
            behavior: 'smooth',
            block: 'center'
        });
    }

    // Setup additional event listeners
    setupEventListeners() {
        // No navigation links - keep it simple and static
    }

    // Show special move demonstration
    showSpecialMove(moveType) {
        this.clearHighlights();
        
        // Clear the board completely
        this.gameState = Array(8).fill().map(() => Array(8).fill(null));
        
        if (moveType === 'castling') {
            // Set up castling demonstration
            this.gameState[7][4] = {type: 'king', color: 'white'};
            this.gameState[7][7] = {type: 'rook', color: 'white'};
            this.gameState[7][0] = {type: 'rook', color: 'white'};
            
            // Re-create the board
            this.createBoard();
            
            // Highlight the pieces involved in castling
            const kingSquare = document.querySelector(`[data-row="7"][data-col="4"]`);
            const rookSquareKingSide = document.querySelector(`[data-row="7"][data-col="7"]`);
            const rookSquareQueenSide = document.querySelector(`[data-row="7"][data-col="0"]`);
            
            kingSquare.classList.add('highlighted');
            rookSquareKingSide.classList.add('highlighted');
            rookSquareQueenSide.classList.add('highlighted');
            
            // Show castling moves
            // King-side castling
            document.querySelector(`[data-row="7"][data-col="6"]`).classList.add('possible-move');
            document.querySelector(`[data-row="7"][data-col="5"]`).classList.add('possible-move');
            
            // Queen-side castling
            document.querySelector(`[data-row="7"][data-col="2"]`).classList.add('possible-move');
            document.querySelector(`[data-row="7"][data-col="3"]`).classList.add('possible-move');
            
        } else if (moveType === 'promotion') {
            // Set up promotion demonstration
            this.gameState[1][4] = {type: 'pawn', color: 'white'};
            
            // Re-create the board
            this.createBoard();
            
            // Highlight the pawn
            const pawnSquare = document.querySelector(`[data-row="1"][data-col="4"]`);
            pawnSquare.classList.add('highlighted');
            
            // Show promotion square
            document.querySelector(`[data-row="0"][data-col="4"]`).classList.add('possible-move');
            
            // Add promotion options visual indicators
            for (let col = 2; col <= 6; col++) {
                const square = document.querySelector(`[data-row="0"][data-col="${col}"]`);
                if (square && col !== 4) {
                    square.classList.add('promotion-option');
                    const promotionPieces = ['♕', '♖', '♗', '♘'];
                    if (promotionPieces[col-2]) {
                        square.textContent = promotionPieces[col-2];
                        square.style.color = '#9b59b6';
                        square.style.fontSize = '1.5rem';
                    }
                }
            }
        }
        
        this.updateSpecialMoveInfo(moveType);
        
        // Scroll to board
        document.getElementById('board').scrollIntoView({ 
            behavior: 'smooth',
            block: 'center'
        });
    }

    // Update information for special moves
    updateSpecialMoveInfo(moveType) {
        const infoElement = document.getElementById('pieceInfo');
        
        if (this.specialMoves[moveType]) {
            const info = this.specialMoves[moveType];
            let moveInstructions = '';
            
            if (moveType === 'castling') {
                moveInstructions = '<p class="demo-instruction"><i class="fas fa-hand-pointer"></i> الملك يتحرك مربعين نحو الطابية، والطابية تقفز فوق الملك. المربعات الخضراء توضح المواضع النهائية</p>';
            } else if (moveType === 'promotion') {
                moveInstructions = '<p class="demo-instruction"><i class="fas fa-hand-pointer"></i> عندما يصل الجندي للصف الأخير، يمكن اختيار أي قطعة لتحل محله (الوزير، الطابية، الفيل، أو الحصان)</p>';
            }
            
            infoElement.innerHTML = `
                <h3>${info.name} - وضع التعلم</h3>
                <p><strong>الوصف:</strong> ${info.description}</p>
                <p><strong>الشروط:</strong> ${info.conditions}</p>
                <p><strong>الفائدة:</strong> ${info.benefit}</p>
                ${moveInstructions}
                <p class="reset-hint"><i class="fas fa-redo"></i> اضغط على "إعادة تعيين" لعرض الرقعة كاملة مرة أخرى</p>
            `;
        }
    }
}

// Global functions
function showPieceMoves(pieceType) {
    if (window.chessApp) {
        window.chessApp.showSpecificPieceMoves(pieceType);
    }
}

function resetBoard() {
    if (window.chessApp) {
        window.chessApp.resetBoard();
    }
}

function clearHighlights() {
    if (window.chessApp) {
        window.chessApp.clearHighlights();
    }
}

function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

function showSpecialMove(moveType) {
    if (window.chessApp) {
        window.chessApp.showSpecialMove(moveType);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.chessApp = new ChessApp();
    
    // Add loading animation to pieces
    setTimeout(() => {
        document.querySelectorAll('.piece-loading').forEach(piece => {
            piece.classList.remove('piece-loading');
        });
    }, 1000);
    
    // Add interactive enhancements
    document.querySelectorAll('.piece-card, .basic-card, .rule-card').forEach(card => {
        card.classList.add('interactive-element');
    });
});

// No navigation effects needed anymore

// Add keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        clearHighlights();
    }
});

// Touch events for mobile
document.addEventListener('touchstart', (e) => {
    // Add touch feedback for mobile devices
    if (e.target.classList.contains('chess-square')) {
        e.target.style.transform = 'scale(0.95)';
        setTimeout(() => {
            e.target.style.transform = '';
        }, 150);
    }
});

// Performance optimization
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Optimized resize handler
window.addEventListener('resize', debounce(() => {
    // Recalculate board size if needed
    const board = document.getElementById('chessBoard');
    if (board) {
        board.style.transform = 'scale(1)';
    }
}, 250));

// Add service worker for offline capability (progressive web app features)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Service worker would be registered here for offline functionality
        console.log('Chess learning app loaded successfully');
    });
}

// Analytics helper (would integrate with actual analytics in production)
function trackInteraction(action, piece = null) {
    console.log(`User interaction: ${action}${piece ? ` with ${piece}` : ''}`);
    // Integration with analytics service would go here
}

// Add interaction tracking
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('piece-card')) {
        const pieceType = e.target.onclick.toString().match(/showPieceMoves\('(\w+)'\)/);
        if (pieceType) {
            trackInteraction('piece_card_click', pieceType[1]);
        }
    }
    
    if (e.target.classList.contains('chess-square')) {
        trackInteraction('board_click');
    }
});
