/**
 * Layout engine factory and selector
 * Provides strategy pattern implementation for layout selection
 */

import { LayoutMode } from '../core/types';
import { LayoutEngine } from './base';
import { VerticalLayout } from './verticalLayout';
import { HorizontalLayout } from './horizontalLayout';
import { CompactVerticalLayout } from './compactVerticalLayout';
import { SymmetricLayout } from './symmetricLayout';

/**
 * Get layout engine instance based on mode
 */
export function getLayoutEngine(mode: LayoutMode): LayoutEngine {
    switch (mode) {
        case 'vertical':
            return new VerticalLayout();
        case 'horizontal':
            return new HorizontalLayout();
        case 'compact-vertical':
            return new CompactVerticalLayout();
        case 'symmetric':
            return new SymmetricLayout();
        default:
            return new VerticalLayout();
    }
}

/**
 * Get all available layout modes
 */
export function getAvailableLayoutModes(): LayoutMode[] {
    return ['vertical', 'horizontal', 'compact-vertical', 'symmetric'];
}
