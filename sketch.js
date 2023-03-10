let button, back, refresh;

let Clubs = [];
let Diamonds = [];
let Hearts = [];
let Spades = [];

let A = 1;
let K = 13;

let w = 100;
let h = 140;

let bg_stock, bg_waste, bg_foundation, bg_tableau;
let stock, waste, foundation, tableau;

let restock = [];

let x = [20, 130, 240, 350, 460, 570, 680];
let y = 30;
let ty = 210;
let offset = 30;

let heldCard = [];
let oldLocation = 'null';

let stateStock, stateWaste, stateRestock, stateFoundation, stateTableau;

let shown = false;
let turnOne = false;
let bg_color = false;

let win = false;

let main = ( sketch ) => {
    sketch.preload = () => {
        refresh = sketch.loadImage('./assets/refresh.png');
    
        back = sketch.loadImage('./assets/cardBack.png');
    
        for (let i = 1; i < 14; ++i) {
            if (i === 1) {
                Clubs.push(sketch.loadImage('./assets/cardClubsA.png'));
            } else if (i === 11) {
                Clubs.push(sketch.loadImage('./assets/cardClubsJ.png'));
            } else if (i === 12) {
                Clubs.push(sketch.loadImage('./assets/cardClubsQ.png'));
            } else if (i === 13) {
                Clubs.push(sketch.loadImage('./assets/cardClubsK.png'));
            } else {
                Clubs.push(sketch.loadImage('./assets/cardClubs' + i + '.png'));
            }
        }
    
        for (let i = 1; i < 14; ++i) {
            if (i === 1) {
                Diamonds.push(sketch.loadImage('./assets/cardDiamondsA.png'));
            } else if (i === 11) {
                Diamonds.push(sketch.loadImage('./assets/cardDiamondsJ.png'));
            } else if (i === 12) {
                Diamonds.push(sketch.loadImage('./assets/cardDiamondsQ.png'));
            } else if (i === 13) {
                Diamonds.push(sketch.loadImage('./assets/cardDiamondsK.png'));
            } else {
                Diamonds.push(sketch.loadImage('./assets/cardDiamonds' + i + '.png'));
            }
        }
    
        for (let i = 1; i < 14; ++i) {
            if (i === 1) {
                Hearts.push(sketch.loadImage('./assets/cardHeartsA.png'));
            } else if (i === 11) {
                Hearts.push(sketch.loadImage('./assets/cardHeartsJ.png'));
            } else if (i === 12) {
                Hearts.push(sketch.loadImage('./assets/cardHeartsQ.png'));
            } else if (i === 13) {
                Hearts.push(sketch.loadImage('./assets/cardHeartsK.png'));
            } else {
                Hearts.push(sketch.loadImage('./assets/cardHearts' + i + '.png'));
            }
        }
    
        for (let i = 1; i < 14; ++i) {
            if (i === 1) {
                Spades.push(sketch.loadImage('./assets/cardSpadesA.png'));
            } else if (i === 11) {
                Spades.push(sketch.loadImage('./assets/cardSpadesJ.png'));
            } else if (i === 12) {
                Spades.push(sketch.loadImage('./assets/cardSpadesQ.png'));
            } else if (i === 13) {
                Spades.push(sketch.loadImage('./assets/cardSpadesK.png'));
            } else {
                Spades.push(sketch.loadImage('./assets/cardSpades' + i + '.png'));
            }
        }
    };

    sketch.setup = () => {
        sketch.createCanvas(sketch.displayWidth, sketch.displayHeight);
    
        if (sketch.width <= 800) {
            cardWidth = sketch.width / 9;
            x[0] = 15;
            for (let i = 1; i < x.length; ++i) {
                x[i] = x[i - 1] + cardWidth + (cardWidth / 5);
            }
            cardHeight = sketch.height / 10;
            ty = y + cardHeight + 40;
            offset = cardHeight * 0.28;
        }

        if (!bg_color) {
            bg_color = sketch.color(0, 100, 0);
        }
    
        bg_stock = new Card(x[0], y, sketch, refresh);
        
        bg_foundation = [];
        for (let i = 0; i < 4; ++i) {
            bg_foundation[i] = new Card(x[i + 3], y, sketch);
        }
    
        bg_tableau = [];
        for (let i = 0; i < 7; ++i) {
            bg_tableau[i] = new Card(x[i], ty, sketch);
        }
    
        fronts = [Clubs, Diamonds, Spades, Hearts];
        deck = [];
        for (let i = 0; i < 4; ++i) {
            for (let j = 0; j < 13; ++j) {
                deck.push(new Card(x[0], y, sketch, fronts[i][j], back, i + 1, j + 1));
            }
        }
    
        stock = [];
        for (let i = 0; i < 24; ++i) {
            index = Math.floor(Math.random() * deck.length);
            deck[index].y = y - 24 * 0.75 + i * 0.75;
            deck[index].startY = y - 24 * 0.75 + i * 0.75;
            stock.push(deck[index]);
            deck.splice(index, 1);
        }
        
        waste = [];
    
        foundation = [];
        for (let i = 0; i < 4; ++i) {
            foundation[i] = [];
        }
    
        tableau = [];
        for (let i = 0; i < 7; ++i) {
            tableau[i] = [];
    
            j = 0;
            while (tableau[i].length < i + 1) {
                index = Math.floor(Math.random() * deck.length);
                if (tableau[i].length === i) {
                    deck[index].flipped = true;
                }
                deck[index].x = x[i];
                deck[index].startX = x[i];
                deck[index].y = ty + j * offset;
                deck[index].startY = ty + j * offset;
                tableau[i].push(deck[index]);
                deck.splice(index, 1);
                j += 1;
            }
        }
    
        stateStock = [];
        stateWaste = [];
        stateRestock = [];
        stateFoundation = [];
        stateTableau = [];
    };
    
    sketch.draw = () => {
        if (!win) {
            sketch.background(bg_color);
    
            bg_stock.show();
            
            for (let i = 0; i < 4; ++i) {
                bg_foundation[i].show();
            }
        
            for (let i = 0; i < 7; ++i) {
                bg_tableau[i].show();
            }
        
            if (waste.length > 0) {
                waste[waste.length - 1].update();
            }
        
            for (let i = 0; i < 4; ++i) {
                for (let j = 0; j < foundation[i].length; ++j) {
                    foundation[i][j].update();
                }
            }
        
        
            for (let i = 0; i < 7; ++i) {
                for (let j = 0; j < tableau[i].length; ++j) {
                    tableau[i][j].update();
                }
            }
        
            for (let i = stock.length - 1; i > 0; --i) {
                stock[i].show();
            }
        
            for (let i = 0; i < waste.length; ++i) {
                waste[i].show();
            }
        
            for (let i = 0; i < 4; ++i) {
                for (let j = 0; j < foundation[i].length; ++j) {
                    foundation[i][j].show();
                }
            }
        
            for (let i = 0; i < 7; ++i) {
                for (let j = 0; j < tableau[i].length; ++j) {
                    tableau[i][j].show();
                }
            }
        
            if (heldCard) {
                for (let i = 0; i < heldCard.length; ++i) {
                    heldCard[i].update();
                    heldCard[i].show();
                }
            }
        } else {
            for (let i = 0; i < 4; ++i) {
                for (let j = foundation[i].length - 1; j >= 0; --j) {
                    foundation[i][j].bounce();
                    foundation[i][j].show();
                }
            } 
        }
    };
    
    wasteTransfer = () => {
        if (restock.length > 0) {
            for (let i = 0; i < restock.length; ++i) {
                restock[i].y -= 0.75 * waste.length;
                restock[i].startY -= 0.75 * waste.length;
            }
        }
    
        if (waste.length > 0) {
            currLength = waste.length - 1;
    
            while (waste.length > 0) {
                currCard = waste.shift();
                currCard.flipped = false;
                currCard.x = x[0];
                currCard.startX = x[0];
                currCard.y = 29.25 - (currLength) * 0.75;
                currCard.startY = 29.25 - (currLength) * 0.75;
                restock.push(currCard);
                currLength -= 1;
            }
        }
    
        if (stock.length === 0) {
            currLength = restock.length;
    
            for (let i = 0; i < currLength; ++i) {
                stock.push(restock.shift());
            }
    
            return 0;
        }
    
        if (turnOne) {
            turnAmount = 1;
        } else {
            turnAmount = 3;
        }

        for (let i = 0; i < turnAmount; ++i) {
            let currCard = stock.shift();
            currCard.flipped = true;
            currCard.x = x[1] + i * offset;
            currCard.startX = x[1] + i * offset;
            currCard.y = y;
            currCard.startY = y;
            waste.push(currCard);
        }
    };
    
    returnHeldCard = () => {
        if (heldCard) {
            for (let i = 0; i < heldCard.length; ++i) {
                heldCard[i].return();
    
                if (oldLocation === 'waste') {
                    waste.push(heldCard[i]);
                } else if (oldLocation.substring(0, oldLocation.length - 1) === 'tableau') {
                    tableau[parseInt(oldLocation[oldLocation.length - 1])].push(heldCard[i]);
                } else if (oldLocation.substring(0, oldLocation.length - 1) === 'foundation') {
                    foundation[parseInt(oldLocation[oldLocation.length - 1])].push(heldCard[i]);
                }
            }
        }
    };
    
    flipTab = () => {
        if (oldLocation.substring(0, oldLocation.length - 1) === 'tableau') {
            currTab = tableau[parseInt(oldLocation[oldLocation.length - 1])]
            if (currTab.length > 0) {
                currTab[currTab.length - 1].flipped = true;
            }
        }
    };
    
    sketch.mousePressed = () => {
        if (shown) {
            return 0;
        }

        if ((sketch.mouseX > x[0] && sketch.mouseX < x[0] + w)
            && (sketch.mouseY > y && sketch.mouseY < y + h)) {
            storeState();
            wasteTransfer();
        }
    
        if (waste.length > 0) {
            waste[waste.length - 1].move();
            if (waste[waste.length - 1].moving) {
                storeState();
                heldCard.push(waste[waste.length - 1]);
                waste.splice(waste.length - 1, 1);
                oldLocation = 'waste'
            }
        }
    
        for (let i = 0; i < 4; ++i) {
            if (foundation[i].length > 0) {
                foundation[i][foundation[i].length - 1].move();
                if (foundation[i][foundation[i].length - 1].moving) {
                    storeState();
                    heldCard.push(foundation[i][foundation[i].length - 1]);
                    foundation[i].splice(foundation[i].length - 1, 1);
                    oldLocation = 'foundation' + i;
                }
            }
        }
    
        for (let i = 0; i < 7; ++i) {
            if (tableau[i].length > 0) {
                for (let j = 0; j < tableau[i].length; ++j) {
                    if (j === tableau[i].length - 1) {
                        tableau[i][tableau[i].length - 1].move();
                        if (tableau[i][tableau[i].length - 1].moving) {
                            storeState();
                            heldCard.push(tableau[i][tableau[i].length - 1]);
                            tableau[i].splice(tableau[i].length - 1, 1);
                            oldLocation = 'tableau' + i;
    
                            break;
                        }
                    }
    
                    tableau[i][j].move(true);
                    if (tableau[i][j].moving) {
                        storeState();
                        for (let k = j; k < tableau[i].length; ++k) {
                            if (k > j) {
                                tableau[i][k].forceMove();
                            }
    
                            heldCard.push(tableau[i][k]);
                        }
    
                        oldLocation = 'tableau' + i;
    
                        currLength = tableau[i].length;
    
                        for (k = j; k < currLength; ++k) {
                            tableau[i].splice(j, 1);
                        }
    
                        break;
                    }
                }
            }
        }
    }
    
    sketch.mouseReleased = () => {
        let ret = true;
    
        for (let i = 0; i < 4; ++i) {
            if ((sketch.mouseX > x[i + 3] && sketch.mouseX < x[i + 3] + w) 
                && (sketch.mouseY > y && sketch.mouseY < y + h)) {
                if (foundation[i].length > 0) {
                    if (heldCard.length === 1 && (heldCard[0].suit === foundation[i][0].suit && heldCard[0].value === foundation[i][foundation[i].length - 1].value + 1)) {
                        heldCard[0].confirm(x[i + 3], y, foundation[i]);
                        flipTab();
                        ret = false;
                    }
                } else {
                    if (heldCard.length === 1 && heldCard[0].value === A) {
                        heldCard[0].confirm(x[i + 3], y, foundation[i]);
                        flipTab();
                        ret = false;
                    }
                } 
            }
        }
    
        for (let i = 0; i < 7; ++i) {
            if (tableau[i].length != 0) {
                currLength = tableau[i].length - 1;
    
                if ((sketch.mouseX > tableau[i][currLength].x && sketch.mouseX < tableau[i][currLength].x + w) 
                    && (sketch.mouseY > tableau[i][currLength].y && sketch.mouseY < tableau[i][currLength].y + h)) {
                    if (heldCard) {
                        if (((heldCard[0].suit % 2 === 0 && tableau[i][currLength].suit % 2 != 0) 
                            || (heldCard[0].suit % 2 != 0 && tableau[i][currLength].suit % 2 === 0))
                            && heldCard[0].value === tableau[i][currLength].value - 1) {
                            for (let j = 0; j < heldCard.length; ++j) {
                                heldCard[j].confirm(tableau[i][currLength].x, tableau[i][currLength].y + (j + 1) * offset, tableau[i]);
                            }
                            flipTab()
                            ret = false;
                        }
                    }
                }
            } else {
                if ((sketch.mouseX > x[i] && sketch.mouseX < x[i] + w) 
                    && (sketch.mouseY > ty && sketch.mouseY < ty + h)) {
                    if (heldCard) {
                        if (heldCard[0].value === K) {
                            for (let j = 0; j < heldCard.length; ++j) {
                                heldCard[j].confirm(x[i], ty + j * offset, tableau[i]);
                            }
                            flipTab();
                            ret = false;
                        } 
                    }
                } 
            }
        }
    
        if (ret === true && heldCard.length > 0) {
            returnHeldCard();
            undo();
        }
    
        for (let i = 0; i < heldCard.length; ++i) {
            heldCard[i].released();
        }
        heldCard = [];

        if (!win) {
            check = true;
            for (let i = 0; i < 4; ++i) {
                if (foundation[i][foundation[i].length - 1].value == K) {
                    check = true;
                } else {
                    check = false;
                    break;
                }
            }
            if (check) {
                win = true;
            }
        }
    };
     
    newGame = () => {
        win = false;

        sketch.setup();
        
        restock = [];
    };
    
    storeState = () => {
        prevStock =  [];
        for (let i = 0; i < stock.length; ++i) {
            prevStock.push(new Card(stock[i].x, stock[i].y, sketch, stock[i].front, stock[i].back, stock[i].suit, stock[i].value));
        }
        stateStock.push(prevStock);
    
        prevWaste = [];
        for (let i = 0; i < waste.length; ++i) {
            prevWaste.push(new Card(waste[i].x, waste[i].y, sketch, waste[i].front, waste[i].back, waste[i].suit, waste[i].value, waste[i].flipped));
        }
        stateWaste.push(prevWaste);
        
        prevRestock = [];
        for (let i = 0; i < restock.length; ++i) {
            prevRestock.push(new Card(restock[i].x, restock[i].y, sketch, restock[i].front, restock[i].back, restock[i].suit, restock[i].value));
        }
        stateRestock.push(prevRestock);
    
        prevFoundation = [[], [], [], []];
        for (let i = 0; i < 4; ++i) {
            for (let j = 0; j < foundation[i].length; ++j) {
                prevFoundation[i].push(new Card(foundation[i][j].x, foundation[i][j].y, sketch, foundation[i][j].front, foundation[i][j].back, foundation[i][j].suit, foundation[i][j].value, foundation[i][j].flipped))
            }
        }
        stateFoundation.push(prevFoundation);
    
        prevTableau = [[], [], [], [], [], [], []];
        for (let i = 0; i < 7; ++i) {
            for (let j = 0; j < tableau[i].length; ++j) {
                prevTableau[i].push(new Card(tableau[i][j].x, tableau[i][j].y, sketch, tableau[i][j].front, tableau[i][j].back, tableau[i][j].suit, tableau[i][j].value, tableau[i][j].flipped))
            }
        }
        stateTableau.push(prevTableau);
    };
    
    undo = () => {
        if (stateStock.length > 0) {
            stock = stateStock[stateStock.length - 1];
            stateStock.splice(stateStock.length - 1, 1);
    
            waste = stateWaste[stateWaste.length - 1];
            stateWaste.splice(stateWaste.length - 1, 1);
    
            restock = stateRestock[stateRestock.length - 1];
            stateRestock.splice(stateRestock.length - 1, 1);
    
            foundation = stateFoundation[stateFoundation.length - 1];
            stateFoundation.splice(stateFoundation.length - 1, 1);
    
            tableau = stateTableau[stateTableau.length - 1];
            stateTableau.splice(stateTableau.length - 1, 1);
        }
    };
}

let mainP5 = new p5(main);

let s = ( sketch ) => {
    let rectColor;
    let count = 0;

    let rVal = 0;
    let gVal = 100;
    let bVal = 0;

    let preTurnOne = false;

    sketch.setup = () => {        
        canvas = sketch.createCanvas(400, 300);

        rectColor = sketch.color(0, 100, 0);

        r = sketch.createSlider(0, 255, 0);
        g = sketch.createSlider(0, 255, 100);
        b = sketch.createSlider(0, 255, 0);

        rIn = sketch.createInput(r.value());
        rIn.size(23);
        gIn = sketch.createInput(g.value());
        gIn.size(23);
        bIn = sketch.createInput(b.value());
        bIn.size(23);

        r.input(() => { update(rIn, r.value()) });
        g.input(() => { update(gIn, g.value()) });
        b.input(() => { update(bIn, b.value()) });

        rIn.input(() => { update(r, rIn.value()) });
        gIn.input(() => { update(g, gIn.value()) });
        bIn.input(() => { update(b, bIn.value()) });

        apply = sketch.createButton('Apply');
        apply.style('background-color', '#0061e8');
        apply.style('color', 'white');
        apply.style('border', 'none');
        apply.style('font', 'Assistant');
        apply.style('cursor', 'pointer');
        apply.style('text-align', 'center');
        apply.style('padding', '10px 15px');
        apply.style('border-radius', '10px');
        apply.style('box-shadow', '0px 2px 5px 0.5px rgba(0, 0, 0, 0.18');
        apply.mousePressed(() => {
            apply.style('opacity', '0.85');
            apply.style('transform', 'scale(0.95)');
        });
        apply.mouseReleased(() => {
            bg_color = rectColor;
            showSettings();
            if (turnOne != preTurnOne) {
                turnOne = preTurnOne;
                newGame();
            }
        });
    };

    sketch.draw = () => {
        if (bg_color && count === 0) {
            rectColor = sketch.color(bg_color.r, bg_color.g, bg_color.b);
        }

        sketch.fill(0);
        sketch.textSize(20);
        sketch.text('Background Color', 10, 20);

        sketch.fill(rectColor);
        sketch.rect(10, 40, 130, 100);

        r.position(canvas.position().x + 190, canvas.position().y + 45);
        g.position(canvas.position().x + 190, canvas.position().y + 80);
        b.position(canvas.position().x + 190, canvas.position().y + 115);

        rIn.position(r.x + 140, r.y);
        gIn.position(g.x + 140, g.y);
        bIn.position(b.x + 140, b.y);

        rVal = r.value();
        gVal = g.value();
        bVal = b.value();
        rectColor = sketch.color(r, g, b);

        sketch.fill(0);
        sketch.textSize(15);
        sketch.text('R', r.x - 30, r.y + 15);
        sketch.text('G', g.x - 30, g.y + 15);
        sketch.text('B', b.x - 30, b.y + 15);

        rectColor = sketch.color(rVal, gVal, bVal);

        sketch.textSize(20);
        sketch.text('Game Type', 10, 180);

        sketch.fill(240);
        turnButton = sketch.rect(10, 200, 130, 50);

        sketch.fill(0);
        sketch.textSize(18);
        if (preTurnOne) {
            sketch.text(' Turn One ', 30, 230);
        } else {
            sketch.text('Turn Three', 30, 230);
        }

        if ((sketch.mouseX > 10 && sketch.mouseX < 10 + 130)
            && (sketch.mouseY > 200 && sketch.mouseY < 200 + 50)) {
            sketch.cursor('pointer');
        } else {
            sketch.cursor('default');
        }

        apply.position(canvas.position().x + 320, canvas.position().y + 260);
        if ((sketch.mouseX > 320 && sketch.mouseX < 320 + 64)
            && (sketch.mouseY > 260 && sketch.mouseY < 260 + 36)) {
            apply.style('opacity', '0.85');
            apply.style('transition', 'all 0.1s ease');
        } else {
            apply.style('opacity', '1');
            apply.style('transition', 'none');
        }

        ++count;
    };

    update = ( field, value ) => {
        field.value(value);
    };

    sketch.mouseClicked = () => {
        if ((sketch.mouseX > 10 && sketch.mouseX < 10 + 130)
            && (sketch.mouseY > 200 && sketch.mouseY < 200 + 50)) {
            if (preTurnOne) {
                preTurnOne = false;
            } else {
                preTurnOne = true;
            }
        }
    };
}

let sP5 = new p5(s, 'settings-box');

function showSettings() {
    let settings = document.getElementById('settings');    
    if(settings.style.display == "none") {
        settings.style.display = "flex";
        shown = true;
    } else {
        settings.style.display = "none";
        shown = false;
    }
}