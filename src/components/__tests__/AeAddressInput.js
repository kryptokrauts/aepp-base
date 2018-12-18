import { mount } from '@vue/test-utils';
import AeAddressInput from '../AeAddressInput.vue';

const testAddress = 'ak_12345678912345678912345678912345678912345678912345';
const testAddressFormatted = 'ak_ 123 456 789 123 456 789 123 456 789 123 456 789 123 456 789 123 45';

describe('AeAddressInput', () => {
  it('formats passed value', () => {
    const wrapper = mount(AeAddressInput, { propsData: { value: testAddress } });
    expect(wrapper.find('textarea').element.value).toBe(testAddressFormatted);
  });

  it('adds prefix on input', () => {
    const wrapper = mount(AeAddressInput);
    const textarea = wrapper.find('textarea');
    textarea.element.value = 'beef';
    textarea.trigger('input');

    const emittedValue = wrapper.emitted('input')[0][0];
    expect(emittedValue).toEqual('ak_beef');
    wrapper.setProps({ value: emittedValue });
    expect(textarea.element.value).toBe('ak_ bee f');
  });

  it('removes non-base58 symbols', () => {
    const wrapper = mount(AeAddressInput);
    const value = 'ak_019AHIJNOPZaklmz';
    const textarea = wrapper.find('textarea');
    textarea.element.value = value;
    textarea.element.setSelectionRange(value.length, value.length);
    textarea.trigger('input');

    const emittedValue = wrapper.emitted('input')[0][0];
    expect(emittedValue).toEqual('ak_19AHJNPZakmz');
    wrapper.setProps({ value: emittedValue });
    expect(textarea.element.value).toBe('ak_ 19A HJN PZa kmz');
  });

  it('emitted input event contains address without space symbols', () => {
    const wrapper = mount(AeAddressInput, { propsData: { value: testAddress } });
    const textarea = wrapper.find('textarea');
    textarea.element.setSelectionRange(10, 10);
    textarea.trigger('input');
    expect(wrapper.emitted().input[0][0]).toBe(testAddress);
  });

  it('limits address length', () => {
    const wrapper = mount(AeAddressInput);
    const begin = testAddressFormatted.slice(0, 25);
    const end = `${testAddressFormatted.slice(25)}test`;
    const textarea = wrapper.find('textarea');
    textarea.element.value = begin + end;
    textarea.element.setSelectionRange(begin.length, begin.length);
    textarea.trigger('input');

    const emittedValue = wrapper.emitted('input')[0][0];
    expect(emittedValue).toEqual(testAddress);
    wrapper.setProps({ value: emittedValue });
    expect(textarea.element.value).toBe(testAddressFormatted);
  });

  it('backspace can remove the whole value', () => {
    const wrapper = mount(AeAddressInput, { propsData: { value: 'ak_12' } });

    const textarea = wrapper.find('textarea');
    while (textarea.element.value) {
      const { value } = textarea.element;
      textarea.element.value = value.slice(0, value.length - 1);
      textarea.element.setSelectionRange(value.length - 1, value.length - 1);
      textarea.trigger('input');
      wrapper.setProps({ value: wrapper.emitted('input').pop()[0] });
      expect(textarea.element.value.length).toBeLessThan(value.length);
    }
  });
});
