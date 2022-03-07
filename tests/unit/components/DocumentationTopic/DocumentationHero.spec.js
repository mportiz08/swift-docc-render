/**
 * This source file is part of the Swift.org open source project
 *
 * Copyright (c) 2022 Apple Inc. and the Swift project authors
 * Licensed under Apache License v2.0 with Runtime Library Exception
 *
 * See https://swift.org/LICENSE.txt for license information
 * See https://swift.org/CONTRIBUTORS.txt for Swift project authors
*/

import DocumentationHero from '@/components/DocumentationTopic/DocumentationHero.vue';
import { shallowMount } from '@vue/test-utils';
import {
  TopicTypes,
  TopicTypeAliases,
  TopicTypeColors,
  TopicTypeColorsMap,
} from '@/constants/TopicTypes';
import NavigatorLeafIcon from '@/components/Navigator/NavigatorLeafIcon.vue';

const defaultProps = {
  type: TopicTypes.class,
};

const createWrapper = ({ propsData, ...others } = {}) => shallowMount(DocumentationHero, {
  propsData: {
    ...defaultProps,
    ...propsData,
  },
  slots: {
    default: '<div class="default-slot">Default Slot</div>',
  },
  ...others,
});

describe('DocumentationHero', () => {
  it('renders the DocumentationHero', () => {
    const wrapper = createWrapper();
    const allIcons = wrapper.findAll(NavigatorLeafIcon);
    expect(allIcons).toHaveLength(2);
    expect(allIcons.at(0).props()).toEqual({
      withColors: true,
      type: defaultProps.type,
    });
    expect(allIcons.at(0).classes()).toEqual(['background-icon', 'first-icon']);
    expect(allIcons.at(1).classes()).toEqual(['background-icon', 'second-icon']);
    // assert slot
    expect(wrapper.find('.default-slot').text()).toBe('Default Slot');
    expect(wrapper.vm.styles).toEqual({
      '--accent-color': `var(--color-type-icon-${TopicTypeColorsMap[defaultProps.type]}, var(--color-figure-gray-secondary))`,
    });
  });

  it('finds aliases, for the color', () => {
    const wrapper = createWrapper({
      propsData: {
        type: TopicTypes.init,
      },
    });
    const color = TopicTypeColorsMap[TopicTypeAliases[TopicTypes.init]];
    expect(wrapper.vm.styles).toEqual({
      '--accent-color': `var(--color-type-icon-${color}, var(--color-figure-gray-secondary))`,
    });
  });

  it('falls back to the teal color for types without a color', () => {
    const wrapper = createWrapper({
      propsData: {
        type: TopicTypes.section,
      },
    });
    expect(wrapper.vm.styles).toEqual({
      '--accent-color': `var(--color-type-icon-${TopicTypeColors.teal}, var(--color-figure-gray-secondary))`,
    });
  });
});
