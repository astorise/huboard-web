class Analytics::CoreTest < ActiveSupport::TestCase
  sut = Analytics::Core

  class FakeAnalytics; end

  test 'attach the underlying client' do
    sut.adapter = FakeAnalytics

    adapter = Analytics::Core.class_variable_get(:@@adapter)
    assert adapter == FakeAnalytics
  end


  test 'identify and tie a user to their actions' do
    FakeAnalytics.stubs(:identify)
    sut.adapter = FakeAnalytics

    adapter = Analytics::Core.class_variable_get(:@@adapter)
    adapter.expects(:identify).with({some: :payload})
    sut.identify({some: :payload})
  end
end
