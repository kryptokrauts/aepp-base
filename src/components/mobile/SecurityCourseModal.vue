<template>
  <Modal class="security-course-modal">
    <img src="../../assets/account-card.svg">
    <Guide :template="$t('security-courses.modal.guide')" />
    <div class="note">
      {{ $t('security-courses.modal.note') }}
    </div>
    <div class="buttons">
      <AeButton
        fill="alternative"
        @click="openSecurityCourse"
      >
        {{ $t('security-courses.modal.to-security-course-1') }}
      </AeButton>
      <AeButton
        plain
        @click="resolve"
      >
        {{ $t('security-courses.modal.skip') }}
      </AeButton>
    </div>
  </Modal>
</template>

<script>
import Modal from './Modal.vue';
import Guide from '../Guide.vue';
import AeButton from '../AeButton.vue';

export default {
  components: { Modal, Guide, AeButton },
  props: {
    resolve: { type: Function, required: true },
  },
  methods: {
    openSecurityCourse() {
      this.resolve();
      this.$router.push({ name: 'settings-security-course-intro', params: { firstEnter: true } });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../../styles/typography';

.security-course-modal {
  text-align: center;

  ::v-deep .modal-plain {
    max-width: rem(275px);
    padding: rem(50px) rem(30px) rem(10px) rem(30px);
  }

  .guide {
    margin-bottom: rem(5px);
  }

  .note {
    @extend %face-sans-base;
    color: $color-neutral-negative-3;
  }

  .buttons {
    display: flex;
    flex-direction: column;
    margin-top: rem(20px);

    .ae-button {
      min-width: 0;
    }
  }
}
</style>
