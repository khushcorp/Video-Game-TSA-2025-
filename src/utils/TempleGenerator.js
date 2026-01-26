/**
 * TempleGenerator.js
 * Creates a detailed Mesoamerican-style stepped pyramid temple
 * Based on ancient Mayan/Aztec architecture
 * NO GAPS - Perfect alignment between all layers
 */

export class TempleGenerator {
    /**
     * Creates the main temple structure - stepped pyramid with building on top
     */
    static createTemple(scene) {
        if (scene.textures.exists('temple-main')) {
            console.log('Temple texture already exists, skipping creation');
            return;
        }
        
        console.log('Creating detailed temple texture...');
        try {
            // Temple dimensions: properly sized for game screen
            const canvas = scene.textures.createCanvas('temple-main', 600, 350);
            const ctx = canvas.context;
            
            const baseY = 350; // Bottom of canvas - this is the ground level (no gap)
            // When texture is used with origin (0.5, 1) at y=400, this baseY aligns with ground top
            const centerX = 300; // Center of temple
            
            // Color palette - ancient, weathered stone
            const stoneBase = '#8B7A6B';      // Weathered stone gray-brown
            const stoneDark = '#6B5B4D';     // Shadow/darker stone
            const stoneMoist = '#7B6B5D';    // Moist patches
            const stoneLight = '#9B8B7B';    // Highlight
            const stoneEdge = '#5A4B3D';     // Edge/detail color
            const mossDark = '#1a3d0a';      // Dark moss
            const mossLight = '#2d5016';     // Light moss
            const vineColor = '#1a3d0a';     // Dark vine green
            const vineLight = '#2d5016';     // Lighter vine
            const roofColor = '#A56B4D';     // Orange-brown for top building
            const roofDark = '#8B5A3D';      // Darker roof
            const doorwayColor = '#1a1a1a';  // Dark doorways
            const carvingColor = '#6B5B4D';  // Carved details (darker than stone)
            
            // === BASE TIER (Widest - sits directly on ground) ===
            const baseWidth = 550;
            const baseHeight = 30;
            const baseLeft = (600 - baseWidth) / 2;
            
            // Base platform - NO GAP from ground
            ctx.fillStyle = stoneBase;
            ctx.fillRect(baseLeft, baseY - baseHeight, baseWidth, baseHeight);
            
            // Individual stone blocks on base with detail
            ctx.fillStyle = stoneDark;
            const baseBlockCount = 11;
            for (let i = 0; i <= baseBlockCount; i++) {
                const x = baseLeft + (i * baseWidth / baseBlockCount);
                // Slight offset for irregular look
                const offset = (i % 2 === 0 ? -0.5 : 0.5);
                ctx.fillRect(x, baseY - baseHeight + offset, 1, baseHeight);
            }
            
            // Horizontal detail lines (stone courses)
            ctx.fillStyle = stoneEdge;
            ctx.fillRect(baseLeft, baseY - 20, baseWidth, 1);
            ctx.fillRect(baseLeft, baseY - 10, baseWidth, 1);
            
            // Top edge highlight
            ctx.fillStyle = stoneLight;
            ctx.fillRect(baseLeft, baseY - baseHeight, baseWidth, 2);
            
            // Moss patches on base
            ctx.fillStyle = mossLight;
            ctx.fillRect(baseLeft + 50, baseY - 25, 35, 6);
            ctx.fillRect(baseLeft + 200, baseY - 27, 30, 5);
            ctx.fillRect(baseLeft + 400, baseY - 26, 32, 6);
            ctx.fillRect(baseLeft + 500, baseY - 24, 28, 5);
            
            // Vines on base edges
            ctx.fillStyle = vineColor;
            for (let i = 0; i < 5; i++) {
                const x = baseLeft + 20 + i * 100;
                const y = baseY - 25 + Math.sin(i * 0.4) * 1;
                ctx.fillRect(x, y, 2, 8);
            }
            
            // === TIER 5 (Bottom tier - connects directly to base, NO GAP) ===
            const tier5Width = 480;
            const tier5Height = 28;
            const tier5Left = (600 - tier5Width) / 2;
            const tier5Y = baseY - baseHeight; // Connects directly to base top
            
            // Main tier block
            ctx.fillStyle = stoneBase;
            ctx.fillRect(tier5Left, tier5Y - tier5Height, tier5Width, tier5Height);
            
            // Stone block divisions
            ctx.fillStyle = stoneDark;
            const tier5Blocks = 9;
            for (let i = 0; i <= tier5Blocks; i++) {
                const x = tier5Left + (i * tier5Width / tier5Blocks);
                const offset = (i % 3 === 0 ? -0.5 : 0);
                ctx.fillRect(x, tier5Y - tier5Height + offset, 1, tier5Height);
            }
            
            // Horizontal detail lines
            ctx.fillStyle = stoneEdge;
            ctx.fillRect(tier5Left, tier5Y - 15, tier5Width, 1);
            
            // Top edge highlight
            ctx.fillStyle = stoneLight;
            ctx.fillRect(tier5Left, tier5Y - tier5Height, tier5Width, 2);
            
            // Architectural detail: Carved pattern on front face
            ctx.fillStyle = carvingColor;
            // Simple geometric pattern
            for (let i = 0; i < 3; i++) {
                const x = tier5Left + 80 + i * 100;
                const y = tier5Y - 20;
                // Small carved circles
                ctx.beginPath();
                ctx.arc(x, y, 3, 0, Math.PI * 2);
                ctx.fill();
            }
            
            // Vines on tier 5
            ctx.fillStyle = vineColor;
            for (let i = 0; i < 4; i++) {
                const x = tier5Left + 60 + i * 110;
                const y = tier5Y - tier5Height + 5 + Math.sin(i * 0.5) * 1;
                ctx.fillRect(x, y, 3, 12);
            }
            
            // Moss patches
            ctx.fillStyle = mossLight;
            ctx.fillRect(tier5Left + 100, tier5Y - tier5Height + 15, 28, 6);
            ctx.fillRect(tier5Left + 350, tier5Y - tier5Height + 17, 25, 5);
            
            // === TIER 4 (Connects directly to tier 5, NO GAP) ===
            const tier4Width = 380;
            const tier4Height = 26;
            const tier4Left = (600 - tier4Width) / 2;
            const tier4Y = tier5Y - tier5Height; // Connects directly
            
            ctx.fillStyle = stoneBase;
            ctx.fillRect(tier4Left, tier4Y - tier4Height, tier4Width, tier4Height);
            
            // Stone blocks
            ctx.fillStyle = stoneDark;
            const tier4Blocks = 7;
            for (let i = 0; i <= tier4Blocks; i++) {
                const x = tier4Left + (i * tier4Width / tier4Blocks);
                ctx.fillRect(x, tier4Y - tier4Height, 1, tier4Height);
            }
            
            // Horizontal detail
            ctx.fillStyle = stoneEdge;
            ctx.fillRect(tier4Left, tier4Y - 12, tier4Width, 1);
            
            // Top edge highlight
            ctx.fillStyle = stoneLight;
            ctx.fillRect(tier4Left, tier4Y - tier4Height, tier4Width, 2);
            
            // Carved decorative pattern
            ctx.fillStyle = carvingColor;
            // Vertical lines pattern
            for (let i = 0; i < 2; i++) {
                const x = tier4Left + 100 + i * 150;
                ctx.fillRect(x, tier4Y - tier4Height + 5, 1, 15);
            }
            
            // Vines
            ctx.fillStyle = vineColor;
            for (let i = 0; i < 3; i++) {
                const x = tier4Left + 50 + i * 130;
                const y = tier4Y - tier4Height + 4;
                ctx.fillRect(x, y, 2, 10);
            }
            
            // Moss
            ctx.fillStyle = mossLight;
            ctx.fillRect(tier4Left + 120, tier4Y - tier4Height + 12, 24, 5);
            ctx.fillRect(tier4Left + 280, tier4Y - tier4Height + 14, 22, 4);
            
            // === TIER 3 (Connects directly to tier 4, NO GAP) ===
            const tier3Width = 280;
            const tier3Height = 24;
            const tier3Left = (600 - tier3Width) / 2;
            const tier3Y = tier4Y - tier4Height; // Connects directly
            
            ctx.fillStyle = stoneBase;
            ctx.fillRect(tier3Left, tier3Y - tier3Height, tier3Width, tier3Height);
            
            // Stone blocks
            ctx.fillStyle = stoneDark;
            const tier3Blocks = 6;
            for (let i = 0; i <= tier3Blocks; i++) {
                const x = tier3Left + (i * tier3Width / tier3Blocks);
                ctx.fillRect(x, tier3Y - tier3Height, 1, tier3Height);
            }
            
            // Horizontal detail
            ctx.fillStyle = stoneEdge;
            ctx.fillRect(tier3Left, tier3Y - 10, tier3Width, 1);
            
            // Top edge highlight
            ctx.fillStyle = stoneLight;
            ctx.fillRect(tier3Left, tier3Y - tier3Height, tier3Width, 2);
            
            // Decorative carving - triangle pattern
            ctx.fillStyle = carvingColor;
            const carveX = tier3Left + tier3Width / 2;
            ctx.beginPath();
            ctx.moveTo(carveX, tier3Y - tier3Height + 5);
            ctx.lineTo(carveX - 8, tier3Y - 8);
            ctx.lineTo(carveX + 8, tier3Y - 8);
            ctx.fill();
            
            // Vines
            ctx.fillStyle = vineColor;
            ctx.fillRect(tier3Left - 2, tier3Y - tier3Height + 3, 3, 15);
            ctx.fillRect(tier3Left + tier3Width - 1, tier3Y - tier3Height + 5, 3, 13);
            
            // === TIER 2 (Connects directly to tier 3, NO GAP) ===
            const tier2Width = 200;
            const tier2Height = 22;
            const tier2Left = (600 - tier2Width) / 2;
            const tier2Y = tier3Y - tier3Height; // Connects directly
            
            ctx.fillStyle = stoneBase;
            ctx.fillRect(tier2Left, tier2Y - tier2Height, tier2Width, tier2Height);
            
            // Stone blocks
            ctx.fillStyle = stoneDark;
            const tier2Blocks = 5;
            for (let i = 0; i <= tier2Blocks; i++) {
                const x = tier2Left + (i * tier2Width / tier2Blocks);
                ctx.fillRect(x, tier2Y - tier2Height, 1, tier2Height);
            }
            
            // Horizontal detail
            ctx.fillStyle = stoneEdge;
            ctx.fillRect(tier2Left, tier2Y - 8, tier2Width, 1);
            
            // Top edge highlight
            ctx.fillStyle = stoneLight;
            ctx.fillRect(tier2Left, tier2Y - tier2Height, tier2Width, 2);
            
            // === TIER 1 (Top tier - connects directly to tier 2, NO GAP) ===
            const tier1Width = 140;
            const tier1Height = 20;
            const tier1Left = (600 - tier1Width) / 2;
            const tier1Y = tier2Y - tier2Height; // Connects directly
            
            ctx.fillStyle = stoneBase;
            ctx.fillRect(tier1Left, tier1Y - tier1Height, tier1Width, tier1Height);
            
            // Stone blocks
            ctx.fillStyle = stoneDark;
            const tier1Blocks = 4;
            for (let i = 0; i <= tier1Blocks; i++) {
                const x = tier1Left + (i * tier1Width / tier1Blocks);
                ctx.fillRect(x, tier1Y - tier1Height, 1, tier1Height);
            }
            
            // Top edge highlight
            ctx.fillStyle = stoneLight;
            ctx.fillRect(tier1Left, tier1Y - tier1Height, tier1Width, 2);
            
            // === CENTRAL STAIRCASE (Connects all tiers) ===
            const stairWidth = 70;
            const stairLeft = (600 - stairWidth) / 2;
            
            // Stairs going up - detailed steps
            ctx.fillStyle = stoneBase;
            const stepCount = 12;
            for (let i = 0; i < stepCount; i++) {
                const stepY = baseY - baseHeight - (i * 4);
                const stepWidth = stairWidth - (i * 2);
                const stepLeft = stairLeft + (i * 1);
                const stepHeight = 4;
                
                // Step
                ctx.fillRect(stepLeft, stepY - stepHeight, stepWidth, stepHeight);
                
                // Step shadow (top edge)
                ctx.fillStyle = stoneDark;
                ctx.fillRect(stepLeft, stepY - stepHeight, stepWidth, 1);
                
                // Step highlight (front face)
                ctx.fillStyle = stoneLight;
                ctx.fillRect(stepLeft, stepY - stepHeight, 1, stepHeight);
                
                ctx.fillStyle = stoneBase;
            }
            
            // === TOP BUILDING (Temple structure at apex) ===
            const buildingWidth = 120;
            const buildingHeight = 45;
            const buildingLeft = (600 - buildingWidth) / 2;
            const buildingY = tier1Y - tier1Height; // Connects directly to tier 1
            
            // Building base
            ctx.fillStyle = stoneBase;
            ctx.fillRect(buildingLeft, buildingY - buildingHeight, buildingWidth, buildingHeight);
            
            // Building walls with detail
            ctx.fillStyle = stoneMoist;
            ctx.fillRect(buildingLeft, buildingY - buildingHeight, buildingWidth, buildingHeight - 18);
            
            // Vertical stone courses on building
            ctx.fillStyle = stoneDark;
            ctx.fillRect(buildingLeft, buildingY - buildingHeight, 1, buildingHeight);
            ctx.fillRect(buildingLeft + buildingWidth - 1, buildingY - buildingHeight, 1, buildingHeight);
            const buildingBlocks = 3;
            for (let i = 1; i < buildingBlocks; i++) {
                const x = buildingLeft + (i * buildingWidth / buildingBlocks);
                ctx.fillRect(x, buildingY - buildingHeight, 1, buildingHeight - 18);
            }
            
            // Roof (orange-brown, stepped)
            ctx.fillStyle = roofColor;
            ctx.fillRect(buildingLeft - 3, buildingY - buildingHeight - 12, buildingWidth + 6, 14);
            ctx.fillStyle = roofDark;
            ctx.fillRect(buildingLeft - 3, buildingY - buildingHeight - 12, buildingWidth + 6, 3);
            // Roof detail lines
            ctx.fillRect(buildingLeft - 3, buildingY - buildingHeight - 8, buildingWidth + 6, 1);
            ctx.fillRect(buildingLeft - 3, buildingY - buildingHeight - 4, buildingWidth + 6, 1);
            
            // Doorways/Windows (two dark openings)
            ctx.fillStyle = doorwayColor;
            const doorwayWidth = 18;
            const doorwayHeight = 22;
            const doorway1X = buildingLeft + 20;
            const doorway2X = buildingLeft + buildingWidth - 38;
            const doorwayY = buildingY - 8;
            
            ctx.fillRect(doorway1X, doorwayY - doorwayHeight, doorwayWidth, doorwayHeight);
            ctx.fillRect(doorway2X, doorwayY - doorwayHeight, doorwayWidth, doorwayHeight);
            
            // Doorway frames (stone)
            ctx.fillStyle = stoneEdge;
            // Left doorway frame
            ctx.fillRect(doorway1X - 2, doorwayY - doorwayHeight - 2, doorwayWidth + 4, 2);
            ctx.fillRect(doorway1X - 2, doorwayY, doorwayWidth + 4, 2);
            ctx.fillRect(doorway1X - 2, doorwayY - doorwayHeight, 2, doorwayHeight);
            ctx.fillRect(doorway1X + doorwayWidth, doorwayY - doorwayHeight, 2, doorwayHeight);
            // Right doorway frame
            ctx.fillRect(doorway2X - 2, doorwayY - doorwayHeight - 2, doorwayWidth + 4, 2);
            ctx.fillRect(doorway2X - 2, doorwayY, doorwayWidth + 4, 2);
            ctx.fillRect(doorway2X - 2, doorwayY - doorwayHeight, 2, doorwayHeight);
            ctx.fillRect(doorway2X + doorwayWidth, doorwayY - doorwayHeight, 2, doorwayHeight);
            
            // Vines on building
            ctx.fillStyle = vineColor;
            ctx.fillRect(buildingLeft - 2, buildingY - buildingHeight + 8, 3, 20);
            ctx.fillRect(buildingLeft + buildingWidth - 1, buildingY - buildingHeight + 10, 3, 18);
            
            // Moss on building
            ctx.fillStyle = mossLight;
            ctx.fillRect(buildingLeft + 15, buildingY - buildingHeight + 5, 20, 4);
            ctx.fillRect(buildingLeft + buildingWidth - 35, buildingY - buildingHeight + 7, 18, 3);
            
            // === ADDITIONAL TEMPLE DETAILS ===
            
            // Carved symbols on various tiers (ancient, chiseled look)
            ctx.fillStyle = carvingColor;
            // Tier 5: Geometric patterns
            for (let i = 0; i < 2; i++) {
                const x = tier5Left + 120 + i * 200;
                const y = tier5Y - 18;
                // Small carved circle
                ctx.beginPath();
                ctx.arc(x, y, 2, 0, Math.PI * 2);
                ctx.fill();
            }
            
            // Tier 4: Line patterns
            for (let i = 0; i < 2; i++) {
                const x = tier4Left + 80 + i * 200;
                ctx.fillRect(x, tier4Y - tier4Height + 8, 12, 1);
            }
            
            // Cracks (weathered look)
            ctx.fillStyle = stoneEdge;
            ctx.fillRect(tier5Left + 180, tier5Y - tier5Height, 1, tier5Height);
            ctx.fillRect(tier4Left + 140, tier4Y - tier4Height, 1, tier4Height);
            ctx.fillRect(tier3Left + 100, tier3Y - tier3Height, 1, tier3Height);
            
            // Moisture patches (darker stone where water collects)
            ctx.fillStyle = stoneMoist;
            ctx.globalAlpha = 0.4;
            ctx.fillRect(tier5Left + 80, tier5Y - tier5Height + 10, 30, 12);
            ctx.fillRect(tier4Left + 200, tier4Y - tier4Height + 8, 25, 10);
            ctx.fillRect(tier3Left + 120, tier3Y - tier3Height + 6, 20, 8);
            ctx.globalAlpha = 1.0;
            
            // Horizontal depth lines (very subtle)
            ctx.fillStyle = stoneDark;
            ctx.globalAlpha = 0.1;
            for (let y = tier5Y - tier5Height; y < baseY - 5; y += 15) {
                ctx.fillRect(baseLeft, y, baseWidth, 1);
            }
            ctx.globalAlpha = 1.0;
            
            canvas.refresh();
            if (scene.textures.exists('temple-main')) {
                scene.textures.get('temple-main').setFilter(Phaser.Textures.FilterMode.NEAREST);
                console.log('✅ TEMPLE TEXTURE CREATED SUCCESSFULLY! Size: 600x350, NO GAPS');
            } else {
                console.error('❌ ERROR: Temple texture was not created!');
            }
        } catch (error) {
            console.error('❌ ERROR creating temple:', error);
            console.error(error.stack);
        }
    }
}
