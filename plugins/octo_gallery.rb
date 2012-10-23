require 'mini_magick'

module Jekyll
  class OctoGallery < Liquid::Block
    def initialize(tag_name, markup, tokens)
      base_path = 'source/images/'
      @title    = markup != '' ? markup.strip : Digest::SHA1.hexdigest(tokens.join)
      @images   = tokens[0].strip.split("\n")
      @images.map!{|line| {src: line[/^[^\s]+/], alt: line.gsub(/^[^\s]+/, '').strip}}

      @images.each do |image|
        #remove prefixed slashes
        image[:src].slice!(0) if image[:src][0] == '/'
        dir       = File.dirname(image[:src])
        extension = File.extname(image[:src])
        name      = File.basename(image[:src], extension)

        image[:thumb] = "#{dir}/#{name}-thumb#{extension}"

        unless File.exists?("#{base_path}#{image[:thumb]}")
          print "generating thumb for #{file}..."
          image = MiniMagick::Image.open("#{base_path}#{file}")
          image.resize  "100x100^"
          width, height = image[:dimensions]
          if width > height
            image.crop "100x100+#{(width-100)/2}+0"
          elsif width < height
            image.crop "100x100+0+#{(height-100)/2}"
          end
          image.write  "#{base_path}#{image[:thumb]}"
          puts "done!"
        end
      end

      super
    end

    def render(context)
      out = '' #'<a class="octogallery" href="hello"><img src="hello.jpg"></a>'
      @images.each do |image|
        out << <<-EOF
<a class="octo_gallery" rel="#{@title}" href="/images/#{image[:src]}">
  <img src="/images/#{image[:thumb]}" alt="#{image[:alt]}">
</a>
        EOF
      end

      out
    end
  end
end

Liquid::Template.register_tag('octogallery', Jekyll::OctoGallery)
Liquid::Template.register_tag('octo_gallery', Jekyll::OctoGallery)

# class Random < Liquid::Block
#   def initialize(tag_name, markup, tokens)
#      super
#      @rand = markup.to_i
#   end

#   def render(context)
#     if rand(@rand) == 0
#        super
#     else
#        ''
#     end
#   end
# end

# Liquid::Template.register_tag('random', Random)
