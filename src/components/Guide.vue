<template>
  <div
    class="guide"
    :class="[fill, size, { 'has-icon': $slots.icon }]"
  >
    <span
      v-if="$slots.icon"
      class="icon"
    >
      <slot name="icon" />
    </span>

    <TemplateRenderer
      v-if="template"
      class="content"
      :node="templateRootNode"
      :slots="$slots"
    />
    <div
      v-else
      class="content"
    >
      <slot />
    </div>
  </div>
</template>

<script>
const renderNodeContent = (createElement, node, slots) => (!node.childNodes.length
  ? node.textContent
  : Array.from(node.childNodes)
    .filter(n => [Node.ELEMENT_NODE, Node.TEXT_NODE].includes(n.nodeType))
    .map((n) => {
      switch (n.tagName) {
        case 'primary':
          return createElement('em', renderNodeContent(createElement, n, slots));
        case 'secondary':
          return createElement('mark', renderNodeContent(createElement, n, slots));
        case 'alternative':
          return createElement('strong', renderNodeContent(createElement, n, slots));
        case 'br':
          return createElement('br');
        case 'p':
          return createElement('p', renderNodeContent(createElement, n, slots));
        case undefined:
          return n.textContent;
        default:
          return slots[n.tagName];
      }
    }));

const TemplateRenderer = {
  functional: true,
  props: {
    node: { type: Node, required: true },
    slots: { type: Object, required: true },
  },
  render(createElement, { data, props }) {
    return createElement(
      'div',
      { class: data.staticClass },
      renderNodeContent(createElement, props.node, props.slots),
    );
  },
};

export default {
  components: { TemplateRenderer },
  props: {
    fill: {
      type: String,
      validator: value => [
        'primary',
        'alternative',
        'neutral',
      ].includes(value),
      default: 'primary',
    },
    size: {
      type: String,
      validator: value => ['small', 'medium', 'big'].includes(value),
      default: 'medium',
    },
    template: {
      type: String,
      default: '',
    },
  },
  computed: {
    templateRootNode() {
      return new DOMParser()
        .parseFromString(`<root>${this.template}</root>`, 'text/xml').childNodes[0];
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../styles/typography';

.guide {
  display: flex;
  margin-bottom: rem(27px);

  &.small {
    @extend %face-sans-base;
    margin-bottom: rem(20px);
  }

  &.medium {
    @extend %face-sans-l;
  }

  &.big {
    font-family: $font-sans;
    font-size: rem(30px);
    line-height: rem(39px);
    margin-bottom: rem(15px);
  }

  > .icon {
    flex-shrink: 0;
    width: rem(30px);
    padding-left: rem(6px);
  }

  .content {
    font-weight: 500;
    letter-spacing: -0.5px;

    img {
      width: rem(23px);
    }

    img, .ae-identicon {
      vertical-align: middle;
    }

    em {
      font-style: normal;
    }

    mark, strong {
      font-weight: 500;
    }

    mark {
      color: $color-secondary;
      background: none;
    }

    strong {
      color: $color-alternative;
    }

    p {
      margin-top: 0;
      margin-bottom: 0;
    }
  }

  &.primary {
    > .icon {
      color: $color-primary;
    }

    .content {
      color: $color-neutral-negative-3;

      em {
        color: $color-primary;
      }
    }
  }

  &.neutral {
    > .icon {
      color: $color-neutral-maximum;
    }

    .content {
      color: rgba(255, 255, 255, 0.66846);

      em,
      .account-inline {
        color: $color-neutral-maximum;
      }
    }
  }

  &.alternative {
    > .icon {
      color: $color-alternative;
    }

    .content {
      color: $color-neutral-negative-3;

      em {
        color: $color-alternative-negative-1;
      }
    }
  }
}
</style>
